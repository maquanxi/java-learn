const { recommendWeights, abilityKeyMap } = require('../config/recommend-config')

function clamp(n) { return Math.max(0, Math.min(100, Math.round(n))) }

function toList(value) {
  if (Array.isArray(value)) return value.filter(Boolean)
  if (!value) return []
  return String(value).split(/[、,，\s/]+/).filter(Boolean)
}

function normalizeText(value) {
  return toList(value).join('').toLowerCase()
}

function includesText(text, key) {
  return text.indexOf(String(key).toLowerCase().replace(/\s+/g, '')) >= 0
}

function collectItemTags(item = {}) {
  return [
    ...(item.tags || []),
    ...(item.requiredSkills || []),
    ...(item.techStack || []),
    ...(item.suitableMajors || []),
    item.direction,
    item.category,
    item.name,
    item.title
  ].filter(Boolean)
}

function listScore(userList, itemList, emptyScore = 60) {
  const list = toList(userList)
  const target = toList(itemList)
  if (!target.length) return { score: emptyScore, hits: [] }
  if (!list.length) return { score: emptyScore - 8, hits: [] }
  const userText = normalizeText(list)
  const hits = target.filter((tag) => includesText(userText, tag) || list.some((v) => includesText(String(tag).toLowerCase(), v)))
  return { score: clamp(42 + hits.length * 18 + Math.min(list.length, 4) * 3), hits }
}

function interestScore(userData = {}, item = {}) {
  return listScore(userData.interests, collectItemTags(item), 58)
}

function skillScore(userData = {}, item = {}) {
  const skills = [
    ...toList(userData.skills),
    ...toList(userData.major),
    ...toList(userData.projectExperience)
  ]
  const required = [
    ...(item.requiredSkills || []),
    ...(item.techStack || []),
    ...(item.tags || [])
  ]
  return listScore(skills, required, 56)
}

function goalScore(userData = {}, item = {}) {
  const goals = toList(userData.goals)
  const text = `${item.name || ''}${item.title || ''}${(item.tags || []).join('')}${item.direction || ''}${item.description || ''}`
  const rules = [
    ['就业', /岗位|就业|开发|数据|运营|工程师|简历|JD/],
    ['高考升学', /高考|志愿|专业|院校|录取|升学/],
    ['竞赛获奖', /国创|大创|竞赛|挑战杯|互联网\+|项目|选题/],
    ['创业', /创新|创业|商业|电商|用户|路演/],
    ['考研', /考研|升学|科研|课程|学习路径/]
  ]
  const hits = rules.filter(([goal, reg]) => goals.includes(goal) && reg.test(text)).map(([goal]) => goal)
  if (!goals.length) return { score: 62, hits: [] }
  return { score: clamp(58 + hits.length * 22), hits }
}

function abilityScore(userData = {}, item = {}, type = 'major') {
  const abilities = userData.abilities || {}
  const keys = abilityKeyMap[type] || Object.keys(abilities)
  const values = keys.map((key) => Number(abilities[key] || 3))
  const avg = values.reduce((sum, value) => sum + value, 0) / Math.max(1, values.length)
  const difficultyPenalty = item.difficulty === '高' ? 8 : item.difficulty === '中高' ? 4 : 0
  return { score: clamp(avg * 20 - difficultyPenalty), hits: keys.filter((key) => Number(abilities[key] || 3) >= 4) }
}

function preferenceScore(userData = {}, item = {}) {
  const preferences = userData.preferences || {}
  const hits = []
  let score = 66
  if (preferences.stability && item.stability === preferences.stability) { score += 12; hits.push('稳定性匹配') }
  if (preferences.salary && item.salaryLevel === preferences.salary) { score += 10; hits.push('薪资偏好匹配') }
  if (preferences.difficulty && item.difficulty && item.difficulty.indexOf(preferences.difficulty) >= 0) { score += 8; hits.push('难度接受度匹配') }
  if (preferences.city || preferences.majorPriority || preferences.competition || preferences.dataSource) { score += 6; hits.push('偏好信息完整') }
  return { score: clamp(score), hits }
}

function buildReasonParts(parts) {
  const reasonList = []
  if (parts.interest.hits.length) reasonList.push(`兴趣命中：${parts.interest.hits.slice(0, 3).join('、')}`)
  if (parts.skill.hits.length) reasonList.push(`技能/经历相关：${parts.skill.hits.slice(0, 3).join('、')}`)
  if (parts.goal.hits.length) reasonList.push(`目标匹配：${parts.goal.hits.join('、')}`)
  if (parts.ability.hits.length) reasonList.push(`能力基础较好：${parts.ability.hits.slice(0, 3).join('、')}`)
  if (parts.preference.hits.length) reasonList.push(parts.preference.hits.join('、'))
  if (!reasonList.length) reasonList.push('当前信息较少，系统按通用成长价值和基础适配度给出推荐')
  return reasonList
}

function buildWeaknessParts(userData = {}, item = {}, type = 'major') {
  const list = []
  if (type === 'job' && item.requiredSkills && item.requiredSkills.length) list.push(`需补齐：${item.requiredSkills.slice(0, 4).join('、')}`)
  if (type === 'project') list.push('需要补齐真实需求、数据来源、原型成果和量化指标')
  if (type === 'major' && item.risk) list.push(item.risk)
  if (!toList(userData.interests).length) list.push('兴趣方向填写较少，建议补充 3-5 个关键词')
  if (!Object.keys(userData.abilities || {}).length) list.push('能力评分缺失，建议完善测评后重新生成')
  return list.length ? list : ['当前短板不明显，建议用作品、报告或志愿草表继续验证']
}

function comprehensiveScore(userData, item, type = 'major') {
  const parts = {
    interest: interestScore(userData, item),
    skill: skillScore(userData, item),
    goal: goalScore(userData, item),
    ability: abilityScore(userData, item, type),
    preference: preferenceScore(userData, item)
  }
  const totalScore = clamp(
    parts.interest.score * recommendWeights.interest +
    parts.skill.score * recommendWeights.skill +
    parts.goal.score * recommendWeights.goal +
    parts.ability.score * recommendWeights.ability +
    parts.preference.score * recommendWeights.preference
  )
  return {
    totalScore,
    detailScores: {
      interestScore: parts.interest.score,
      skillScore: parts.skill.score,
      goalScore: parts.goal.score,
      abilityScore: parts.ability.score,
      preferenceScore: parts.preference.score
    },
    reasonList: buildReasonParts(parts),
    weaknessList: buildWeaknessParts(userData, item, type)
  }
}

module.exports = {
  interestScore,
  skillScore,
  goalScore,
  abilityScore,
  preferenceScore,
  comprehensiveScore
}
