const fs = require('fs')
const path = require('path')

function safeRequire(modulePath, fallbackValue) {
  try {
    return require(modulePath)
  } catch (err) {
    return fallbackValue
  }
}

const fallbackMajors = [
  { id: 'm1', name: '软件工程', tags: ['软件开发', 'Java 后端', '工程实践'], suitableFor: '高中生/大学生', difficulty: '中高', employment: '就业面广，适合工程型人才', recommendedJobs: ['Java 后端开发工程师', '软件测试工程师'], reason: '适合喜欢编码、系统设计和持续实践的学生', risk: '学习强度较高，需长期项目训练', learningAdvice: '先打牢编程、数据库、工程化基础' },
  { id: 'm2', name: '计算机科学与技术', tags: ['软件开发', '人工智能', '算法'], suitableFor: '高中生/大学生', difficulty: '高', employment: '基础扎实，升学和就业选择多', recommendedJobs: ['算法工程师助理', '人工智能应用开发'], reason: '覆盖计算机核心能力，适合继续深造', risk: '数学和算法要求较高', learningAdvice: '重视数据结构、操作系统和算法训练' },
  { id: 'm3', name: '数据科学与大数据技术', tags: ['数据分析', 'Python', '统计'], suitableFor: '高中生/大学生', difficulty: '中高', employment: '数据岗位需求稳定增长', recommendedJobs: ['Python 数据分析师', '数据库管理员'], reason: '适合对数据、业务洞察和建模感兴趣的人', risk: '需要统计基础和工具熟练度', learningAdvice: '学习 Python、SQL、可视化和统计分析' },
  { id: 'm4', name: '人工智能', tags: ['人工智能', '数学', '算法'], suitableFor: '高中生/大学生', difficulty: '高', employment: '新兴方向，项目展示价值高', recommendedJobs: ['人工智能应用开发', '算法工程师助理'], reason: '适合愿意挑战数学与模型应用的学生', risk: '入门门槛较高，避免只学概念', learningAdvice: '从 Python、机器学习和应用项目入手' },
  { id: 'm5', name: '信息管理与信息系统', tags: ['数据分析', '产品', '管理'], suitableFor: '高中生/大学生', difficulty: '中', employment: '连接技术与业务，就业弹性好', recommendedJobs: ['产品助理', '数据分析师'], reason: '适合兼具沟通、业务理解和数据意识的人', risk: '技术深度需主动补强', learningAdvice: '补充数据库、原型设计和业务分析能力' },
  { id: 'm6', name: '教育技术学', tags: ['教育服务', '产品', '数字媒体'], suitableFor: '高中生/大学生', difficulty: '中', employment: '教育数字化应用广泛', recommendedJobs: ['教育产品运营', '产品助理'], reason: '适合关注教育、内容和技术融合的人', risk: '纯技术竞争力需补齐', learningAdvice: '学习课程设计、数据分析和产品原型' }
]

const fallbackJobs = [
  { id: 'j1', name: 'Java 后端开发工程师', tags: ['软件开发', 'Java 后端'], requiredSkills: ['Java', '数据库', '接口开发'], suitableMajors: ['软件工程', '计算机科学与技术'], difficulty: '中高', salaryLevel: '中高', stability: '中', matchReason: '适合工程实践能力强、愿意深入后端系统的学生', improveAdvice: '补强 Java 基础、Spring Boot 和项目部署' },
  { id: 'j2', name: '前端开发工程师', tags: ['前端开发', '数字媒体'], requiredSkills: ['HTML/CSS', 'JavaScript', '交互实现'], suitableMajors: ['软件工程', '数字媒体技术'], difficulty: '中', salaryLevel: '中', stability: '中', matchReason: '适合喜欢界面实现和用户体验的人', improveAdvice: '积累小程序、Web 页面和组件化作品' },
  { id: 'j3', name: 'Python 数据分析师', tags: ['数据分析', 'Python'], requiredSkills: ['Python', 'SQL', '统计分析'], suitableMajors: ['数据科学与大数据技术', '财务管理'], difficulty: '中', salaryLevel: '中', stability: '中', matchReason: '适合对数据洞察和业务分析感兴趣的人', improveAdvice: '补充 SQL、Pandas 和可视化报告能力' },
  { id: 'j4', name: '人工智能应用开发', tags: ['人工智能', '软件开发'], requiredSkills: ['Python', '模型调用', '应用开发'], suitableMajors: ['人工智能', '计算机科学与技术'], difficulty: '高', salaryLevel: '高', stability: '中', matchReason: '适合技术兴趣强且愿意做 AI 应用项目的人', improveAdvice: '先做可展示的 AI 小程序或工具原型' },
  { id: 'j5', name: '教育产品运营', tags: ['教育服务', '产品'], requiredSkills: ['课程设计', '用户运营', '数据分析'], suitableMajors: ['教育技术学', '电子商务'], difficulty: '中', salaryLevel: '中', stability: '中高', matchReason: '适合关注教育场景和学习产品的人', improveAdvice: '做课程活动方案、用户调研和效果复盘' }
]

const fallbackProjects = [
  { id: 'p1', title: '基于 AI 的大学生就业能力画像与岗位匹配小程序', direction: '人工智能', tags: ['人工智能', '就业', '小程序'], techStack: ['微信小程序', 'JavaScript', 'Mock 推荐算法'], difficulty: '中高', innovation: '画像与岗位推荐闭环', feasibility: '适合国创原型展示' },
  { id: 'p2', title: '基于大数据分析的高考志愿辅助推荐系统', direction: '数据分析', tags: ['高考升学', '数据分析'], techStack: ['小程序', '数据可视化'], difficulty: '中', innovation: '多维志愿辅助', feasibility: '可用本地样例数据演示' },
  { id: 'p3', title: '基于知识图谱的大学生学习路径规划系统', direction: '教育科技', tags: ['学习路径', '知识图谱'], techStack: ['图谱建模', '可视化'], difficulty: '高', innovation: '路径节点可解释', feasibility: '可先做规则版' },
  { id: 'p4', title: '县域农产品电商供需匹配与溯源小程序', direction: '乡村振兴', tags: ['乡村振兴', '电子商务'], techStack: ['小程序', '数据看板', '运营分析'], difficulty: '中', innovation: '服务农业现代化和县域经济', feasibility: '适合电商与软件专业合作' },
  { id: 'p5', title: '低碳校园行为积分与碳减排估算系统', direction: '绿色低碳', tags: ['双碳', '校园服务'], techStack: ['规则模型', '数据可视化', '小程序'], difficulty: '中', innovation: '将绿色发展转化为可量化行动', feasibility: '数据采集门槛低' }
]

const fallbackPaths = [
  { id: 'path1', name: 'Java 后端', stages: ['Java 基础', '数据库与接口', 'Spring Boot 项目', '部署与简历'], courses: ['Java 程序设计', 'MySQL', 'Spring Boot'], practiceProjects: ['学生管理系统', '岗位推荐 API'], competitionAdvice: '参加软件设计、服务外包类竞赛' },
  { id: 'path2', name: '前端开发', stages: ['HTML/CSS', 'JavaScript', '小程序组件', '作品集'], courses: ['前端基础', '微信小程序', '交互设计'], practiceProjects: ['个人主页', '校园服务小程序'], competitionAdvice: '参加互联网+、网页设计类竞赛' },
  { id: 'path3', name: 'Python 数据分析', stages: ['Python 基础', 'SQL', '可视化', '业务报告'], courses: ['Python', 'Pandas', '数据可视化'], practiceProjects: ['高考志愿数据看板', '就业岗位分析'], competitionAdvice: '参加数学建模、数据分析竞赛' },
  { id: 'path4', name: '人工智能应用', stages: ['Python', '机器学习基础', '模型应用', 'AI 产品原型'], courses: ['机器学习', 'AI 应用开发', '数据标注'], practiceProjects: ['简历匹配工具', '图像分类小程序'], competitionAdvice: '参加人工智能应用和大创项目' }
]

const fallbackSourceConfig = {
  nationalSources: [
    { name: '阳光高考信息平台', type: 'admission', url: 'https://gaokao.chsi.com.cn/' },
    { name: '全国大学生创业服务网', type: 'competition', url: 'https://cy.ncss.cn/' },
    { name: '全国大学生就业服务平台', type: 'career', url: 'https://www.ncss.cn/' },
    { name: '教育部官网', type: 'policy', url: 'https://www.moe.gov.cn/' },
    { name: '人力资源和社会保障部', type: 'career', url: 'https://www.mohrss.gov.cn/' }
  ],
  provinceSources: [
    { province: '河南', name: '河南省教育考试院', url: 'https://www.haeea.cn/', aliases: ['河南省', '豫'] },
    { province: '湖北', name: '湖北省教育考试院', url: 'https://www.hbea.edu.cn/', aliases: ['湖北省', '鄂'] },
    { province: '湖南', name: '湖南省教育考试院', url: 'https://www.hneeb.cn/', aliases: ['湖南省', '湘', '湖南招生考试信息港'] },
    { province: '广东', name: '广东省教育考试院', url: 'https://eea.gd.gov.cn/', aliases: ['广东省', '粤'] },
    { province: '浙江', name: '浙江省教育考试院', url: 'https://www.zjzs.net/', aliases: ['浙江省', '浙'] },
    { province: '四川', name: '四川省教育考试院', url: 'https://www.sceea.cn/', aliases: ['四川省', '川', '蜀'] }
  ]
}

const fallbackHotDirections = {
  officialPolicySources: [
    { title: '数字中国建设整体布局规划', url: 'https://www.gov.cn/zhengce/2023-02/27/content_5743484.htm', signal: '数字基础设施、数据资源、数字政务、数字社会' },
    { title: '“十四五”数字经济发展规划', url: 'https://www.gov.cn/zhengce/content/2022-01/12/content_5667817.htm', signal: '产业数字化、数字产业化、数据要素、平台治理' },
    { title: '全国大学生创业服务网', url: 'https://cy.ncss.cn/', signal: '创新创业训练、项目申报、竞赛展示' },
    { title: '全国大学生就业服务平台', url: 'https://www.ncss.cn/', signal: '就业指导、岗位信息、毕业生服务' }
  ],
  projectDirections: [
    {
      name: 'AI+就业能力画像',
      keywords: ['人工智能', '就业', '软件', '数据', '计算机'],
      policySignal: '就业优先、数字经济、人才强国',
      suitableMajors: '软件工程、人工智能、数据科学、信息管理',
      topicSeeds: ['大学生就业能力画像与岗位匹配系统', '基于岗位JD的简历诊断与学习路径推荐'],
      dataSources: ['全国大学生就业服务平台岗位信息', '学校就业质量报告', '问卷与访谈数据'],
      outputs: ['画像指标体系', '岗位匹配规则/模型', '小程序原型'],
      metrics: ['匹配准确率', '简历修改前后评分差', '用户完成率']
    },
    {
      name: '教育数字化与学习路径',
      keywords: ['教育', '学习', '软件', '人工智能', '数字媒体'],
      policySignal: '教育数字化、数字中国、公共服务均等化',
      suitableMajors: '教育技术学、软件工程、数字媒体技术、计算机类',
      topicSeeds: ['基于知识图谱的课程学习路径规划', 'AI助教答疑与错题归因小程序'],
      dataSources: ['课程大纲', '学习记录', '题库标签', '问卷反馈'],
      outputs: ['知识点图谱', '学习路径推荐', '错题分析'],
      metrics: ['学习完成率', '推荐采纳率', '满意度']
    }
  ]
}

const majors = safeRequire('./data/majors', safeRequire('../../data/majors', fallbackMajors))
const jobs = safeRequire('./data/jobs', safeRequire('../../data/jobs', fallbackJobs))
const projects = safeRequire('./data/projects', safeRequire('../../data/projects', fallbackProjects))
const learningPaths = safeRequire('./data/paths', safeRequire('../../data/paths', fallbackPaths))
const sourceConfig = safeRequire('./data/sourceConfig', safeRequire('../../data/sourceConfig', fallbackSourceConfig))
const hotDirections = safeRequire('./data/hotDirections', safeRequire('../../data/hotDirections', fallbackHotDirections))

const provinceSources = sourceConfig.provinceSources || fallbackSourceConfig.provinceSources
const nationalSources = sourceConfig.nationalSources || fallbackSourceConfig.nationalSources
const officialPolicySources = hotDirections.officialPolicySources || fallbackHotDirections.officialPolicySources
const projectDirections = hotDirections.projectDirections || fallbackHotDirections.projectDirections

const provinceCodeMap = {
  北京: 'beijing',
  天津: 'tianjin',
  河北: 'hebei',
  山西: 'shanxi',
  内蒙古: 'neimenggu',
  辽宁: 'liaoning',
  吉林: 'jilin',
  黑龙江: 'heilongjiang',
  上海: 'shanghai',
  江苏: 'jiangsu',
  浙江: 'zhejiang',
  安徽: 'anhui',
  福建: 'fujian',
  江西: 'jiangxi',
  山东: 'shandong',
  河南: 'henan',
  湖北: 'hubei',
  湖南: 'hunan',
  广东: 'guangdong',
  广西: 'guangxi',
  海南: 'hainan',
  重庆: 'chongqing',
  四川: 'sichuan',
  贵州: 'guizhou',
  云南: 'yunnan',
  西藏: 'xizang',
  陕西: 'shaanxi',
  甘肃: 'gansu',
  青海: 'qinghai',
  宁夏: 'ningxia',
  新疆: 'xinjiang'
}

const categoryCodeMap = {
  物理: 'physics',
  物理类: 'physics',
  历史: 'history',
  历史类: 'history',
  理科: 'science',
  文科: 'arts',
  普通类: 'general',
  综合: 'general',
  综合改革: 'general'
}

const embeddedRankTables = {
  '湖北-物理-2025': {
    province: '湖北',
    provinceCode: 'hubei',
    year: 2025,
    category: '物理类',
    categoryCode: 'physics',
    sourceName: '湖北省教育考试院/湖北省教育厅',
    sourceType: '官方高考分数段统计表',
    sourceUrl: 'https://jyt.hubei.gov.cn/bmdt/ztzl/gxzs/zszy/zsfw/202506/P020250625730351882018.pdf',
    updatedAt: '2025-06-25',
    rows: [
      { score: 600, sameScoreCount: 426, cumulativeCount: 14274 },
      { score: 550, sameScoreCount: 779, cumulativeCount: 44422 },
      { score: 500, sameScoreCount: 877, cumulativeCount: 86678 },
      { score: 462, sameScoreCount: 858, cumulativeCount: 119769 },
      { score: 461, sameScoreCount: 899, cumulativeCount: 120668 },
      { score: 434, sameScoreCount: 702, cumulativeCount: 142516 }
    ]
  },
  '湖北-历史-2025': {
    province: '湖北',
    provinceCode: 'hubei',
    year: 2025,
    category: '历史类',
    categoryCode: 'history',
    sourceName: '湖北省教育考试院/湖北省教育厅',
    sourceType: '官方高考分数段统计表',
    sourceUrl: 'https://jyt.hubei.gov.cn/bmdt/ztzl/gxzs/zszy/zsfw/202506/P020250625730351260572.pdf',
    updatedAt: '2025-06-25',
    rows: [
      { score: 600, sameScoreCount: 126, cumulativeCount: 3166 },
      { score: 550, sameScoreCount: 264, cumulativeCount: 13647 },
      { score: 500, sameScoreCount: 360, cumulativeCount: 28838 },
      { score: 462, sameScoreCount: 424, cumulativeCount: 42830 },
      { score: 461, sameScoreCount: 399, cumulativeCount: 43229 }
    ]
  },
  '河南-物理-2024': {
    province: '河南',
    provinceCode: 'henan',
    year: 2024,
    category: '理科',
    categoryCode: 'science',
    sourceName: '河南省教育考试院',
    sourceType: '官方高考分数段统计表',
    sourceUrl: 'https://www.haeea.cn/a/202406/43344_af412c0e.shtml',
    updatedAt: '2024-06-25',
    rows: [
      { score: 550, sameScoreCount: 1257, cumulativeCount: 73108 },
      { score: 500, sameScoreCount: 1671, cumulativeCount: 147838 },
      { score: 454, sameScoreCount: 1810, cumulativeCount: 226897 },
      { score: 453, sameScoreCount: 1778, cumulativeCount: 228675 },
      { score: 452, sameScoreCount: 1762, cumulativeCount: 230437 },
      { score: 434, sameScoreCount: 1839, cumulativeCount: 262825 }
    ]
  }
}

function normalizeText(value) {
  return String(value == null ? '' : value)
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .trim()
}

function compactText(value) {
  if (Array.isArray(value)) return value.map(compactText).join(' ')
  if (value && typeof value === 'object') return Object.keys(value).map((key) => compactText(value[key])).join(' ')
  return String(value == null ? '' : value)
}

function splitKeywords(query = '') {
  return normalizeText(query)
    .split(/[^\u4e00-\u9fa5a-z0-9+#.]+/i)
    .map((item) => item.trim())
    .filter((item) => item.length >= 2 && !/^20\d{2}$/.test(item))
}

function scoreItem(item, query, fieldKeys) {
  const targetText = normalizeText(fieldKeys.map((key) => compactText(item[key])).join(' '))
  const queryText = normalizeText(query)
  const tokens = splitKeywords(query)
  let score = 0
  if (queryText && targetText.indexOf(queryText) >= 0) score += 12
  tokens.forEach((token) => {
    if (targetText.indexOf(token) >= 0) score += token.length >= 4 ? 4 : 2
  })
  return score
}

function searchList(list, query, fieldKeys, limit) {
  return list
    .map((item) => ({ item, score: scoreItem(item, query, fieldKeys) }))
    .sort((a, b) => b.score - a.score)
    .filter((entry, index) => entry.score > 0 || index < limit)
    .slice(0, limit)
    .map((entry) => ({ ...entry.item, matchScore: entry.score }))
}

function searchMajor(query, options = {}) {
  const items = searchList(
    majors,
    query,
    ['name', 'tags', 'suitableFor', 'employment', 'recommendedJobs', 'reason', 'risk', 'learningAdvice'],
    options.limit || 4
  )
  return {
    success: true,
    query,
    items,
    note: '专业工具查询本地专业知识库，适合给 DeepSeek 提供专业方向、就业岗位和学习建议。'
  }
}

function searchJob(query, options = {}) {
  const items = searchList(
    jobs,
    query,
    ['name', 'tags', 'requiredSkills', 'suitableMajors', 'matchReason', 'improveAdvice'],
    options.limit || 4
  )
  return {
    success: true,
    query,
    items,
    note: '岗位工具查询本地岗位知识库，用于补充岗位背景、技能要求和补弱路径。'
  }
}

function searchCompetition(query, options = {}) {
  const topicItems = searchList(
    projects,
    query,
    ['title', 'direction', 'tags', 'techStack', 'innovation', 'feasibility', 'description', 'route', 'expectedResult'],
    options.limit || 5
  )
  const directionItems = searchList(
    projectDirections,
    query,
    ['name', 'keywords', 'policySignal', 'suitableMajors', 'topicSeeds', 'dataSources', 'outputs', 'metrics'],
    3
  )
  return {
    success: true,
    query,
    topics: topicItems,
    policyDirections: directionItems,
    officialSources: officialPolicySources.slice(0, 4),
    note: '竞赛工具优先围绕国家方向、真实需求、数据来源、原型产出和量化指标生成选题。'
  }
}

function searchLearningPath(query, options = {}) {
  const items = searchList(
    learningPaths,
    query,
    ['name', 'stages', 'courses', 'practiceProjects', 'competitionAdvice'],
    options.limit || 4
  )
  return {
    success: true,
    query,
    items,
    note: '学习路径工具返回阶段、课程、实践项目和竞赛建议，适合生成可执行学习计划。'
  }
}

function findProvinceSource(province = '') {
  const normalized = String(province || '').replace(/\s/g, '').replace(/省|市|自治区|壮族|回族|维吾尔|特别行政区/g, '')
  return provinceSources.find((item) => {
    const names = [item.province].concat(item.aliases || [])
    return names.some((name) => {
      const current = String(name).replace(/\s/g, '').replace(/省|市|自治区|壮族|回族|维吾尔|特别行政区/g, '')
      return current === normalized || normalized.indexOf(current) >= 0 || current.indexOf(normalized) >= 0
    })
  }) || null
}

function extractProvince(text = '') {
  const source = provinceSources.find((item) => {
    const names = [item.province].concat(item.aliases || [])
    return names.some((name) => name && text.indexOf(name) >= 0)
  })
  return source ? source.province : ''
}

function normalizeProvince(province = '') {
  const source = findProvinceSource(province)
  const provinceName = source ? source.province : String(province || '').replace(/省|市|自治区/g, '').trim()
  return {
    provinceName,
    provinceCode: provinceCodeMap[provinceName] || ''
  }
}

function normalizeCategory(category = '') {
  const text = String(category || '')
  let categoryName = '普通类'
  if (/物理|理科|理工/.test(text)) categoryName = /理科/.test(text) && !/物理/.test(text) ? '理科' : '物理类'
  else if (/历史|文科|文史/.test(text)) categoryName = /文科/.test(text) && !/历史/.test(text) ? '文科' : '历史类'
  else if (/综合|普通|不分科/.test(text)) categoryName = '普通类'
  return {
    categoryName,
    categoryCode: categoryCodeMap[categoryName] || 'general',
    subjectKey: categoryName.indexOf('历史') >= 0 || categoryName.indexOf('文科') >= 0 ? '历史' : categoryName.indexOf('物理') >= 0 || categoryName.indexOf('理科') >= 0 ? '物理' : '综合'
  }
}

function extractYear(text = '') {
  const match = String(text).match(/20\d{2}/)
  return match ? Number(match[0]) : new Date().getFullYear()
}

function extractScore(text = '') {
  const source = String(text)
  const exact = source.match(/([1-7]\d{2})\s*分/)
  if (exact) return Number(exact[1])
  const label = source.match(/(?:分数|成绩|考了|总分|score)[：:\s]*([1-7]\d{2})/)
  if (label) return Number(label[1])
  return null
}

function parseRankQuery(text = '', extra = {}) {
  return {
    province: extra.province || extractProvince(text),
    year: Number(extra.year || extra.targetYear || extractYear(text)),
    category: extra.category || extra.subjectType || normalizeCategory(text).categoryName,
    score: Number(extra.score || extractScore(text))
  }
}

function readJsonIfExists(filePath) {
  try {
    if (!fs.existsSync(filePath)) return null
    return JSON.parse(fs.readFileSync(filePath, 'utf8'))
  } catch (err) {
    return null
  }
}

function rankDataPaths(province, year, category) {
  const { provinceCode } = normalizeProvince(province)
  const { categoryCode, subjectKey } = normalizeCategory(category)
  if (!provinceCode || !categoryCode) return []
  const categoryCodes = subjectKey === '物理'
    ? [categoryCode, 'physics', 'science']
    : subjectKey === '历史'
      ? [categoryCode, 'history', 'arts']
      : [categoryCode, 'general']
  const uniqueCodes = Array.from(new Set(categoryCodes))
  return uniqueCodes.reduce((paths, code) => {
    const filename = `${provinceCode}_${code}.json`
    return paths.concat([
      path.join(__dirname, 'data', 'ranks', String(year), filename),
      path.join(__dirname, '..', '..', 'data', 'ranks', String(year), filename)
    ])
  }, [])
}

function normalizeRankTable(table) {
  if (!table || !Array.isArray(table.rows)) return null
  const rows = table.rows
    .map((row) => ({
      score: Number(row.score),
      sameScoreCount: Number(row.sameScoreCount == null ? row.sameScorePeople : row.sameScoreCount),
      cumulativeCount: Number(row.cumulativeCount == null ? row.rank : row.cumulativeCount)
    }))
    .filter((row) => Number.isFinite(row.score) && Number.isFinite(row.cumulativeCount))
    .sort((a, b) => b.score - a.score)
  if (!rows.length) return null
  return { ...table, rows }
}

function loadRankTable(province, year, category) {
  const fileTable = rankDataPaths(province, year, category)
    .map(readJsonIfExists)
    .find(Boolean)
  if (fileTable) return normalizeRankTable(fileTable)

  const { provinceName } = normalizeProvince(province)
  const { subjectKey } = normalizeCategory(category)
  return normalizeRankTable(embeddedRankTables[`${provinceName}-${subjectKey}-${year}`])
}

function buildRankSourceHint(province, year, category) {
  const source = findProvinceSource(province)
  const provinceName = source ? source.province : province || '对应省份'
  const officialSiteName = source ? source.name : `${provinceName}教育考试院`
  return {
    officialSiteName,
    officialUrl: source ? source.url : '',
    suggestedKeywords: [
      `${provinceName} ${year} 高考 一分一段表 ${category}`,
      `${provinceName} ${year} 高考 成绩分数段统计表 ${category}`,
      `${provinceName} ${year} 普通高校招生 分数段表 ${category}`,
      `${officialSiteName} ${year} 一分一段表`
    ],
    note: '建议优先使用省教育考试院、招生考试院、考试局等官方来源；不要直接采用未经核验的第三方转载数据。'
  }
}

function queryGaokaoRank(input = {}) {
  const province = input.province || ''
  const year = Number(input.year)
  const category = input.category || ''
  const score = Number(input.score)

  if (!province || !year || !category || !Number.isFinite(score)) {
    return {
      success: false,
      message: '缺少省份、年份、科类或分数，暂不能查询一分一段表。',
      province,
      year,
      category,
      score: Number.isFinite(score) ? score : undefined,
      officialSearchHint: buildRankSourceHint(province, year || new Date().getFullYear(), category || '普通类')
    }
  }

  if (score < 0 || score > 900) {
    return {
      success: false,
      message: '分数不合理，请输入 0 到 900 之间的整数。',
      province,
      year,
      category,
      score
    }
  }

  const table = loadRankTable(province, year, category)
  if (!table) {
    return {
      success: false,
      message: `未找到 ${province} ${year} 年 ${category} 的一分一段表 JSON 数据。`,
      province,
      year,
      category,
      score,
      officialSearchHint: buildRankSourceHint(province, year, category)
    }
  }

  const row = table.rows.find((item) => item.score === score)
  if (!row) {
    const nearestLower = table.rows.find((item) => item.score < score) || null
    const nearestHigher = [...table.rows].reverse().find((item) => item.score > score) || null
    return {
      success: false,
      message: `当前官方 JSON 中没有 ${score} 分对应记录，可能是该分数没有考生或数据尚未完整录入。本工具不使用邻近分估算位次。`,
      province: table.province,
      year: table.year,
      category: table.category,
      score,
      nearestLower,
      nearestHigher,
      officialSearchHint: buildRankSourceHint(province, year, category)
    }
  }

  const sameScoreCount = Number(row.sameScoreCount) || 0
  const cumulativeCount = Number(row.cumulativeCount)
  const rankStart = sameScoreCount > 0 ? Math.max(1, cumulativeCount - sameScoreCount + 1) : cumulativeCount
  const rankEnd = cumulativeCount

  return {
    success: true,
    province: table.province,
    year: table.year,
    category: table.category,
    score,
    sameScoreCount,
    cumulativeCount,
    rankStart,
    rankEnd,
    referenceRank: rankEnd,
    rankRange: `${rankStart} - ${rankEnd}`,
    sourceName: table.sourceName,
    sourceType: table.sourceType,
    sourceUrl: table.sourceUrl,
    updatedAt: table.updatedAt,
    explanation: '一分一段表给出每个分数对应的同分人数和累计人数。同分考生形成位次区间，志愿填报建议使用累计人数作为保守参考位次。'
  }
}

function searchNews(query, options = {}) {
  const text = String(query || '')
  const province = options.province || extractProvince(text)
  const provinceSource = province ? findProvinceSource(province) : null
  const officialSources = []
  if (provinceSource) {
    officialSources.push({
      title: `${provinceSource.name} 官方入口`,
      type: 'province-admission',
      url: provinceSource.url,
      signal: '一分一段表、投档线、招生政策等省级官方信息'
    })
  }
  officialSources.push(...nationalSources.map((item) => ({
    title: item.name,
    type: item.type,
    url: item.url,
    signal: item.type === 'competition' ? '竞赛申报与创新创业' : item.type === 'career' ? '就业与职业发展' : '升学、政策或公共数据'
  })))
  officialSources.push(...officialPolicySources.map((item) => ({
    title: item.title,
    type: 'policy',
    url: item.url,
    signal: item.signal
  })))
  const items = searchList(officialSources, query, ['title', 'type', 'signal'], options.limit || 6)
  return {
    success: true,
    query,
    items,
    note: '资讯工具返回官方入口和政策线索；如配置 BING_SEARCH_KEY，云函数还会并行补充实时网络搜索结果。'
  }
}

function shouldRunRankTool(text, event = {}) {
  if (event.scene === '志愿填报') return true
  return /(一分一段|一分一档|位次|排位|排名|名次|排多少名|多少名|排第|分数段|累计人数|志愿|投档|录取|高考)/.test(text) && extractScore(text)
}

function shouldRunMajorTool(text) {
  return /(专业|学科|课程|考研|方向介绍|适合什么专业|专业推荐)/.test(text)
}

function shouldRunJobTool(text, event = {}) {
  return event.scene === '就业方向' || /(就业|岗位|职业|招聘|简历|面试|技能|薪资|JD)/i.test(text)
}

function shouldRunCompetitionTool(text, event = {}) {
  return event.scene === '选题比赛' || /(竞赛|比赛|国创|大创|挑战杯|互联网\+|创新创业|选题|项目申报|课题)/.test(text)
}

function shouldRunLearningTool(text) {
  return /(学习路径|学习计划|路线|课程|补弱|提升|怎么学|入门|作品集|项目实践)/.test(text)
}

function shouldRunNewsTool(text) {
  return /(最新|政策|资讯|通知|官网|官方|来源|新闻|入口|发布)/.test(text)
}

async function runLightMcpTools({ query = '', event = {} } = {}) {
  const payloadText = event && event.payload ? JSON.stringify(event.payload) : ''
  const text = `${query || ''} ${event.scene || ''} ${payloadText}`
  const results = []

  if (shouldRunRankTool(text, event)) {
    const rankInput = parseRankQuery(text, event.payload || {})
    results.push({ tool: 'searchGaokaoRank', title: '高考位次查询', data: queryGaokaoRank(rankInput) })
  }
  if (shouldRunMajorTool(text)) {
    results.push({ tool: 'searchMajor', title: '专业搜索', data: searchMajor(text) })
  }
  if (shouldRunJobTool(text, event)) {
    results.push({ tool: 'searchJob', title: '岗位搜索', data: searchJob(text) })
  }
  if (shouldRunCompetitionTool(text, event)) {
    results.push({ tool: 'searchCompetition', title: '竞赛/选题搜索', data: searchCompetition(text) })
  }
  if (shouldRunLearningTool(text) || shouldRunJobTool(text, event)) {
    results.push({ tool: 'searchLearningPath', title: '学习路径搜索', data: searchLearningPath(text) })
  }
  if (shouldRunNewsTool(text) || shouldRunRankTool(text, event) || shouldRunCompetitionTool(text, event)) {
    results.push({ tool: 'searchNews', title: '官方资讯线索', data: searchNews(text, { province: extractProvince(text) }) })
  }

  return {
    used: results.length > 0,
    hits: results.length,
    results
  }
}

function buildToolContext(toolRun) {
  if (!toolRun || !toolRun.results || !toolRun.results.length) return ''
  const body = toolRun.results.map((item) => {
    return `【${item.title}/${item.tool}】\n${JSON.stringify(item.data, null, 2)}`
  }).join('\n\n')
  return `\n\n【轻量 MCP 工具查询结果】\n${body}\n\n请优先基于以上云函数内置工具结果回答；涉及一分一段表时，未命中精确分数不要自行估算位次。`
}

function buildLocalToolAnswer(toolRun) {
  if (!toolRun || !toolRun.results || !toolRun.results.length) return ''
  const lines = ['已使用云函数内置轻量 MCP 工具查询到以下结果：']
  toolRun.results.forEach((entry) => {
    const data = entry.data || {}
    if (entry.tool === 'searchGaokaoRank' && data.success) {
      lines.push(`${data.province}${data.year}年${data.category}${data.score}分：同分人数 ${data.sameScoreCount}，累计人数 ${data.cumulativeCount}，参考位次区间 ${data.rankRange}，建议保守参考 ${data.referenceRank}。来源：${data.sourceName}${data.sourceUrl ? ` ${data.sourceUrl}` : ''}`)
    } else if (entry.tool === 'searchGaokaoRank') {
      lines.push(`位次查询：${data.message || '未命中官方 JSON 数据'}。`)
      if (data.officialSearchHint) lines.push(`官方核验建议：${data.officialSearchHint.officialSiteName}，关键词：${data.officialSearchHint.suggestedKeywords.join('；')}`)
    } else if (data.items && data.items.length) {
      const names = data.items.slice(0, 3).map((item) => item.name || item.title).filter(Boolean).join('、')
      lines.push(`${entry.title}：${names}`)
    } else if (data.topics && data.topics.length) {
      lines.push(`${entry.title}：${data.topics.slice(0, 3).map((item) => item.title).join('、')}`)
    }
  })
  return lines.join('\n')
}

module.exports = {
  searchMajor,
  searchJob,
  searchCompetition,
  searchLearningPath,
  searchNews,
  queryGaokaoRank,
  buildRankSourceHint,
  runLightMcpTools,
  buildToolContext,
  buildLocalToolAnswer
}
