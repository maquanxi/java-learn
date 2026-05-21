const {
  nationalSources,
  provinceSources,
  admissionKeywords,
  competitionKeywords,
  careerKeywords
} = require('../data/sourceConfig')

function getProvinceNames() {
  return provinceSources.map((item) => item.province)
}

function normalizeProvinceText(text = '') {
  return String(text)
    .replace(/\s/g, '')
    .replace(/省|市|自治区|壮族|回族|维吾尔|特别行政区/g, '')
}

function getProvinceSource(province) {
  const target = normalizeProvinceText(province)
  if (!target) return provinceSources[15]
  return provinceSources.find((item) => {
    const names = [item.province].concat(item.aliases || []).map(normalizeProvinceText)
    return names.some((current) => current === target || target.indexOf(current) >= 0 || current.indexOf(target) >= 0)
  }) || { province: target, name: `${province}教育考试院`, url: '' }
}

function crawlSource(source, keywords) {
  if (!source || !source.url) {
    return Promise.resolve({
      source,
      ok: true,
      protected: true,
      statusClass: 'manual',
      statusText: '需确认',
      message: '未匹配到省级考试院入口，请重新选择省份。',
      links: []
    })
  }
  return Promise.resolve({
    source,
    ok: true,
    protected: true,
    statusClass: source.type === 'policy' ? 'ok' : 'manual',
    statusText: source.type === 'policy' ? '政策来源' : '官方入口',
    message: source.type === 'policy'
      ? '已加载官方政策来源，可作为选题方向依据。'
      : '微信小程序环境不稳定抓取官网页面，当前仅加载官方入口；需要具体数据时请打开官方页面核对后粘贴导入。',
    links: [{ title: `打开/复制 ${source.name}`, url: source.url }]
  })
}

function crawlAdmissionSources(province) {
  const provinceSource = getProvinceSource(province)
  const yangguang = nationalSources.find((item) => item.type === 'admission')
  const university = nationalSources.find((item) => item.type === 'university')
  return Promise.all([
    crawlSource(provinceSource, admissionKeywords),
    crawlSource(yangguang, admissionKeywords),
    crawlSource(university, ['高等学校', '学校', '本科', '专科', '名单'])
  ])
}

function crawlCompetitionSources() {
  const source = nationalSources.find((item) => item.type === 'competition')
  const policySources = nationalSources.filter((item) => item.type === 'policy')
  return Promise.all([
    crawlSource(source, competitionKeywords),
    ...policySources.map((item) => crawlSource(item, competitionKeywords))
  ])
}

function crawlCareerSources() {
  const sources = nationalSources.filter((item) => item.type === 'career')
  return Promise.all(sources.map((item) => crawlSource(item, careerKeywords)))
}

module.exports = {
  getProvinceNames,
  getProvinceSource,
  crawlAdmissionSources,
  crawlCompetitionSources,
  crawlCareerSources
}
