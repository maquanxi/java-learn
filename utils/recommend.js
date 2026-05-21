const majors = require('../data/majors')
const jobs = require('../data/jobs')
const projects = require('../data/projects')
const paths = require('../data/paths')
const { comprehensiveScore } = require('./score')
const { defaultActions } = require('../config/recommend-config')

function sourceText(item = {}) {
  if (!item.sourceName) return '本地知识库，建议结合官方来源复核'
  return `${item.sourceName}${item.sourceYear ? `（${item.sourceYear}）` : ''}`
}

function actionList(userData, item, type) {
  if (type === 'job') {
    return [
      item.improveAdvice || '补齐岗位核心技能',
      '准备项目背景、个人职责、技术难点、量化结果和复盘',
      '用目标岗位 JD 反向检查简历关键词'
    ]
  }
  if (type === 'project') {
    return [
      '先完成问卷/访谈并保留样本证据',
      item.route || '需求调研 -> 原型设计 -> 数据建模 -> 测试展示',
      '准备项目计划书、演示视频和答辩材料'
    ]
  }
  return [
    item.learningAdvice || defaultActions.major[0],
    '核对课程设置、选科限制、校区和转专业规则',
    '把该方向放入冲稳保或大学成长计划中验证'
  ]
}

function withReason(userData, item, type) {
  const result = comprehensiveScore(userData, item, type)
  const nextActions = actionList(userData, item, type)
  return {
    ...item,
    match: result.totalScore,
    totalScore: result.totalScore,
    detailScores: result.detailScores,
    reasonList: result.reasonList,
    weaknessList: result.weaknessList,
    actionList: nextActions,
    sourceText: sourceText(item),
    reason: result.reasonList.join('；'),
    weakness: result.weaknessList.join('；'),
    nextStep: nextActions.join('；'),
    type
  }
}

function top3(list, userData, type) {
  return list
    .map((item) => withReason(userData, item, type))
    .sort((a, b) => b.match - a.match)
    .slice(0, 3)
}

function recommendMajors(userData, profile) { return top3(majors, userData, 'major') }
function recommendJobs(userData, profile) { return top3(jobs, userData, 'job') }
function recommendProjects(userData, profile) { return top3(projects, userData, 'project') }

function recommendLearningPath(userData, profile, topJob = {}) {
  const text = `${topJob.name || ''}${(userData.interests || []).join('')}${userData.skills || ''}`
  let path = paths.find((p) => text.includes(p.name)) || paths.find((p) => text.includes('前端') && p.name === '前端开发') || paths[0]
  if (text.includes('数据')) path = paths[2]
  if (text.includes('测试')) path = paths[3]
  if (text.includes('产品')) path = paths[4]
  if (text.includes('人工智能')) path = paths[5]
  return { ...path, sourceText: '学习路径规则库，可结合用户反馈持续优化' }
}

module.exports = { recommendMajors, recommendJobs, recommendProjects, recommendLearningPath }
