const { provinceSources } = require('./sourceConfig')

// 官方一分一段表本地校验数据。
// 只保留已从省级考试院/教育厅官方页面核对过的分数行；未命中的分数不做邻近估算。
const officialRankData = {
  '湖北-物理-2025': {
    sourceName: '湖北省教育考试院/湖北省教育厅',
    subjectLabel: '普通类（首选物理）',
    sourceUrl: 'https://jyt.hubei.gov.cn/bmdt/ztzl/gxzs/zszy/zsfw/202506/P020250625730351882018.pdf',
    pageUrl: 'https://www.hbea.edu.cn/html/2025-06/15292.html',
    format: 'PDF',
    rows: [
      { score: 600, sameScorePeople: 426, rank: 14274 },
      { score: 550, sameScorePeople: 779, rank: 44422 },
      { score: 500, sameScorePeople: 877, rank: 86678 },
      { score: 462, sameScorePeople: 858, rank: 119769 },
      { score: 461, sameScorePeople: 899, rank: 120668 },
      { score: 434, sameScorePeople: 702, rank: 142516 }
    ]
  },
  '湖北-历史-2025': {
    sourceName: '湖北省教育考试院/湖北省教育厅',
    subjectLabel: '普通类（首选历史）',
    sourceUrl: 'https://jyt.hubei.gov.cn/bmdt/ztzl/gxzs/zszy/zsfw/202506/P020250625730351260572.pdf',
    pageUrl: 'https://www.hbea.edu.cn/html/2025-06/15292.html',
    format: 'PDF',
    rows: [
      { score: 600, sameScorePeople: 126, rank: 3166 },
      { score: 550, sameScorePeople: 264, rank: 13647 },
      { score: 500, sameScorePeople: 360, rank: 28838 },
      { score: 462, sameScorePeople: 424, rank: 42830 },
      { score: 461, sameScorePeople: 399, rank: 43229 }
    ]
  },
  '湖北-物理-2024': {
    sourceName: '湖北省教育考试院',
    subjectLabel: '普通类（首选物理）',
    sourceUrl: 'https://www.hbea.edu.cn/html/2024-06/14293.html',
    format: '图片',
    rows: [
      { score: 600, sameScorePeople: 474, rank: 17613 },
      { score: 550, sameScorePeople: 789, rank: 48808 },
      { score: 500, sameScorePeople: 834, rank: 89501 },
      { score: 463, sameScorePeople: 782, rank: 119955 },
      { score: 462, sameScorePeople: 744, rank: 120699 }
    ]
  },
  '湖北-历史-2024': {
    sourceName: '湖北省教育考试院',
    subjectLabel: '普通类（首选历史）',
    sourceUrl: 'https://www.hbea.edu.cn/html/2024-06/14292.html',
    format: '图片',
    rows: [
      { score: 600, sameScorePeople: 133, rank: 2176 },
      { score: 550, sameScorePeople: 216, rank: 9426 },
      { score: 500, sameScorePeople: 392, rank: 21955 },
      { score: 462, sameScorePeople: 372, rank: 34098 },
      { score: 461, sameScorePeople: 362, rank: 34460 }
    ]
  },
  '湖北-物理-2023': {
    sourceName: '湖北省教育考试院',
    subjectLabel: '普通类（首选物理）',
    sourceUrl: 'https://www.hbea.edu.cn/html/2023-06/13629.html',
    format: '图片',
    rows: [
      { score: 600, sameScorePeople: 635, rank: 19328 },
      { score: 550, sameScorePeople: 596, rank: 46527 },
      { score: 500, sameScorePeople: 826, rank: 79456 },
      { score: 464, sameScorePeople: 708, rank: 103168 },
      { score: 462, sameScorePeople: 778, rank: 104514 }
    ]
  },
  '湖南-物理-2024': {
    sourceName: '湖南招生考试信息港',
    subjectLabel: '物理科目组合',
    sourceUrl: 'https://www.hneeb.cn/hnxxg/741/742/content_4207.html',
    format: '网页',
    rows: [
      { score: 550, sameScorePeople: 703, rank: 41285, localBonusPeople: 716, localBonusRank: 41437 },
      { score: 542, sameScorePeople: 782, rank: 47367, localBonusPeople: 785, localBonusRank: 47543 },
      { score: 541, sameScorePeople: 747, rank: 48114, localBonusPeople: 770, localBonusRank: 48313 },
      { score: 500, sameScorePeople: 1166, rank: 90443, localBonusPeople: 1165, localBonusRank: 90653 }
    ]
  },
  '湖南-历史-2024': {
    sourceName: '湖南招生考试信息港',
    subjectLabel: '历史科目组合',
    sourceUrl: 'https://www.hneeb.cn/hnxxg/741/742/content_4206.html',
    format: '网页',
    rows: [
      { score: 550, sameScorePeople: 222, rank: 9063, localBonusPeople: 218, localBonusRank: 9143 },
      { score: 542, sameScorePeople: 242, rank: 11070, localBonusPeople: 243, localBonusRank: 11160 }
    ]
  },
  '湖南-物理-2023': {
    sourceName: '湖南省教育考试院',
    subjectLabel: '物理科目组合',
    sourceUrl: 'https://jyt.hunan.gov.cn/jyt/sjyt/hnsjyksy/web/ksyzkzx/202306/t20230625_29383688.html',
    format: '网页',
    rows: [
      { score: 550, sameScorePeople: 651, rank: 41536, localBonusPeople: 640, localBonusRank: 41667 },
      { score: 542, sameScorePeople: 676, rank: 46990, localBonusPeople: 687, localBonusRank: 47160 }
    ]
  },
  '河南-物理-2024': {
    sourceName: '河南省教育考试院',
    subjectLabel: '理科',
    sourceUrl: 'https://www.haeea.cn/a/202406/43344_af412c0e.shtml',
    pageUrl: 'https://jyt.henan.gov.cn/2024/06-25/3012766.html',
    format: '网页',
    rows: [
      { score: 550, sameScorePeople: 1257, rank: 73108 },
      { score: 500, sameScorePeople: 1671, rank: 147838 },
      { score: 454, sameScorePeople: 1810, rank: 226897 },
      { score: 453, sameScorePeople: 1778, rank: 228675 },
      { score: 452, sameScorePeople: 1762, rank: 230437 },
      { score: 434, sameScorePeople: 1839, rank: 262825 }
    ]
  },
  '河南-历史-2024': {
    sourceName: '河南省教育考试院',
    subjectLabel: '文科',
    sourceUrl: 'https://www.haeea.cn/a/202406/43344_af412c0e.shtml',
    pageUrl: 'https://jyt.henan.gov.cn/2024/06-25/3012766.html',
    format: '网页',
    rows: []
  }
}

function normalizeProvinceText(text = '') {
  return String(text)
    .replace(/\s/g, '')
    .replace(/省|市|自治区|壮族|回族|维吾尔|特别行政区/g, '')
}

function getCanonicalProvince(province = '') {
  const target = normalizeProvinceText(province)
  const hit = provinceSources.find((item) => {
    const names = [item.province].concat(item.aliases || []).map(normalizeProvinceText)
    return names.some((current) => current === target || target.indexOf(current) >= 0 || current.indexOf(target) >= 0)
  })
  return hit ? hit.province : target
}

function getOfficialProvinceSource(province = '') {
  const target = normalizeProvinceText(province)
  return provinceSources.find((item) => {
    const names = [item.province].concat(item.aliases || []).map(normalizeProvinceText)
    return names.some((current) => current === target || target.indexOf(current) >= 0 || current.indexOf(target) >= 0)
  }) || null
}

function normalizeSubject(subjectType = '') {
  if (/物理|理科|理工/.test(subjectType)) return '物理'
  if (/历史|文科|文史/.test(subjectType)) return '历史'
  return '综合'
}

function normalizeScore(score) {
  const match = String(score == null ? '' : score).match(/\d{2,3}/)
  return match ? Number(match[0]) : Number(score)
}

function getRankPack(province, subjectType, year) {
  return officialRankData[`${getCanonicalProvince(province)}-${normalizeSubject(subjectType)}-${year}`] || null
}

function getKnownRankSources(province, subjectType, year) {
  const pack = getRankPack(province, subjectType, year)
  if (!pack) {
    const source = getOfficialProvinceSource(province)
    return source ? [{
      title: `${source.name} ${year} 一分一段表官方入口`,
      url: source.url,
      entryOnly: true
    }] : []
  }
  const links = []
  if (pack.pageUrl && pack.pageUrl !== pack.sourceUrl) {
    links.push({
      title: `${pack.sourceName} ${year} 一分一段表发布页`,
      url: pack.pageUrl
    })
  }
  links.push({
    title: `${pack.sourceName} ${year} ${pack.subjectLabel}一分一段表`,
    url: pack.sourceUrl
  })
  return links
}

function getFallbackRank(province, subjectType, year, score) {
  const pack = getRankPack(province, subjectType, year)
  if (!pack) return null
  const target = normalizeScore(score)
  const exact = pack.rows.find((item) => item.score === target)
  if (!exact) return null
  return {
    sourceName: pack.sourceName,
    sourceUrl: pack.sourceUrl,
    subjectLabel: pack.subjectLabel,
    rank: {
      ...exact,
      sourceType: 'official-exact',
      targetScore: target,
      sourceName: pack.sourceName,
      sourceUrl: pack.sourceUrl,
      subjectLabel: pack.subjectLabel,
      releaseFormat: pack.format
    }
  }
}

module.exports = {
  getFallbackRank,
  getKnownRankSources,
  getRankPack,
  normalizeSubject,
  getCanonicalProvince
}
