const { getProvinceSource } = require('./sourceCrawler')
const { getFallbackRank, getKnownRankSources, getCanonicalProvince } = require('../data/rankFallback')

function buildYears(targetYear) {
  const current = Number(targetYear) || new Date().getFullYear()
  return Array.from({ length: 5 }).map((_, index) => current - index)
}

function normalizeSubject(subjectType = '') {
  if (/历史|文科|文史/.test(subjectType)) return ['历史', '文科', '文史', 'history']
  if (/物理|理科|理工/.test(subjectType)) return ['物理', '理科', '理工', 'science']
  return ['综合', '普通', '不分科', 'general']
}

function normalizeScore(score) {
  const match = String(score == null ? '' : score).match(/\d{2,3}/)
  return match ? Number(match[0]) : Number(score)
}

function stripTags(text = '') {
  return text
    .replace(/<script[\s\S]*?<\/script>/gi, '')
    .replace(/<style[\s\S]*?<\/style>/gi, '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/\s+/g, ' ')
    .trim()
}

function parseScoreRankRows(raw = '', subjectType = '') {
  const text = stripTags(String(raw))
  const rows = []
  const pieces = text
    .replace(/(\d{3})\s+(\d{1,8})\s+(\d{1,8})\s+(\d{1,8})\s+(\d{1,8})/g, '\n$1 $2 $3 $4 $5\n')
    .replace(/(^|[^\d])(\d{3})\s+(\d{1,8})\s+(\d{1,8})(?!\d)(?!\s+\d)/g, '$1\n$2 $3 $4\n')
    .split(/\n|;|；/)
  pieces.forEach((line) => {
    const nums = line.match(/\d{1,8}/g) || []
    if (nums.length < 2) return
    const score = Number(nums[0])
    if (score < 100 || score > 750) return
    const people = nums.length >= 3 ? Number(nums[1]) : 0
    const rank = nums.length >= 5 ? Number(nums[2]) : Number(nums[nums.length - 1])
    if (!rank || rank < people) return
    const row = {
      score,
      sameScorePeople: people,
      rank,
      raw: line.trim()
    }
    if (nums.length >= 5) {
      row.localBonusPeople = Number(nums[3])
      row.localBonusRank = Number(nums[4])
    }
    rows.push(row)
  })
  const dedup = {}
  rows.forEach((row) => {
    if (!dedup[row.score] || row.rank < dedup[row.score].rank) dedup[row.score] = row
  })
  return Object.keys(dedup).map((key) => dedup[key]).sort((a, b) => b.score - a.score)
}

function findRankByScore(rows = [], score) {
  const target = normalizeScore(score)
  if (!target) return null
  const exact = rows.find((item) => item.score === target)
  return exact ? { ...exact, sourceType: 'exact', targetScore: target } : null
}

function queryCloudRank({ province, subjectType, score, year }, source, knownSources) {
  if (typeof wx === 'undefined' || !wx.cloud || !wx.cloud.callFunction) return Promise.resolve(null)
  return new Promise((resolve) => {
    wx.cloud.callFunction({
      name: 'aiAdvisor',
      data: {
        action: 'queryGaokaoRank',
        payload: {
          province,
          year,
          category: subjectType,
          score
        }
      },
      success(res) {
        const result = res.result || {}
        const rankResult = result.rank || {}
        if (rankResult.success) {
          resolve({
            year,
            source,
            status: 'ok',
            message: '已命中云函数官方一分一段表 JSON 精确分数行。',
            links: rankResult.sourceUrl ? [{ title: `${rankResult.sourceName} ${rankResult.year} ${rankResult.category}一分一段表`, url: rankResult.sourceUrl }] : knownSources,
            rank: {
              score: rankResult.score,
              sameScorePeople: rankResult.sameScoreCount,
              rank: rankResult.referenceRank,
              rankStart: rankResult.rankStart,
              rankEnd: rankResult.rankEnd,
              targetScore: rankResult.score,
              sourceType: 'cloud-json',
              sourceName: rankResult.sourceName,
              sourceUrl: rankResult.sourceUrl,
              subjectLabel: rankResult.category,
              releaseFormat: rankResult.sourceType
            }
          })
          return
        }
        resolve(null)
      },
      fail() {
        resolve(null)
      }
    })
  })
}

function buildManualRankResult({ canonicalProvince, source, knownSources, province, subjectType, score, year }) {
  if (!source.url) {
    return {
      year,
      source,
      status: 'manual',
      message: `未匹配到${province || ''}的省级考试院入口，请重新选择省份。`,
      links: knownSources,
      rank: null
    }
  }
  return {
    year,
    source,
    status: 'manual',
    message: `暂未命中 ${canonicalProvince} ${year} 年${subjectType || ''}${score || ''}分的本地官方精确行。为避免官网 412 拦截和错误估算，请先整理官方一分一段表 JSON，或打开官方入口核对后粘贴表格文本导入。`,
    links: knownSources.length ? knownSources : [{ title: `${source.name} 官方入口`, url: source.url, entryOnly: true }],
    rank: null
  }
}

function queryYearRank({ province, subjectType, score, year }) {
  const canonicalProvince = getCanonicalProvince(province)
  const source = getProvinceSource(canonicalProvince)
  const fallback = getFallbackRank(canonicalProvince, subjectType, year, score)
  const knownSources = getKnownRankSources(canonicalProvince, subjectType, year)
  if (fallback) {
    return Promise.resolve({
      year,
      source,
      status: 'ok',
      message: '已命中省级官方一分一段表精确分数行。',
      links: knownSources.length ? knownSources : [{ title: fallback.sourceName, url: fallback.sourceUrl }],
      rank: fallback.rank
    })
  }

  const manualResult = buildManualRankResult({ canonicalProvince, source, knownSources, province, subjectType, score, year })
  return queryCloudRank({ province: canonicalProvince, subjectType, score, year }, source, knownSources)
    .then((cloudResult) => cloudResult || manualResult)
}

function queryFiveYearRanks(params) {
  const years = buildYears(params.targetYear)
  return Promise.all(years.map((year) => queryYearRank({ ...params, year })))
}

function parseManualRankText(text = '', score, year, subjectType) {
  const rows = parseScoreRankRows(text, subjectType)
  const rank = findRankByScore(rows, score)
  return rank ? { year, status: 'ok', rank, message: '' } : { year, status: 'missing', message: '粘贴内容中未找到该分数对应位次。' }
}

module.exports = {
  buildYears,
  queryFiveYearRanks,
  parseManualRankText,
  parseScoreRankRows,
  findRankByScore
}
