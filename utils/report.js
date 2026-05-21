const reportCopy = {
  gaokao: {
    title: '《学涯智航高考升学规划报告》',
    majorLabel: '推荐专业/志愿方向',
    pathLabel: '高考后规划',
    advice: '综合建议：先核验官方一分一段、投档线和招生章程，再按冲稳保形成志愿草表。'
  },
  competition: {
    title: '《学涯智航竞赛选题分析报告》',
    projectLabel: '推荐竞赛/国创选题',
    pathLabel: '项目推进路径',
    advice: '综合建议：先补齐真实需求、数据来源、原型作品和团队分工，再打磨申报材料。'
  },
  growth: {
    title: '《学涯智航大学成长规划报告》',
    projectLabel: '推荐成长项目',
    pathLabel: '大学成长路径',
    advice: '综合建议：把课程、项目、升学和作品集拆成阶段目标，并按月复盘。'
  },
  career: {
    title: '《学涯智航求职规划报告》',
    jobLabel: '推荐岗位',
    pathLabel: '求职学习路径',
    advice: '综合建议：围绕目标岗位JD补齐技能、项目作品、简历表达和面试案例。'
  }
}

function getCopy(planType) {
  return reportCopy[planType] || reportCopy.gaokao
}

function generateReport(userData, profile, recommendations) {
  const planType = userData.planType || recommendations.planType || 'gaokao'
  const copy = getCopy(planType)
  const report = {
    id: `r_${Date.now()}`,
    createdAt: new Date().toLocaleString(),
    userData,
    profile,
    recommendations,
    summary: `系统已根据“${userData.planLabel || '测评'}”生成对应方案。推荐结果仅供参考。`
  }
  const lines = [
    copy.title,
    `生成时间：${report.createdAt}`,
    `测评主题：${userData.planLabel || '未填写'}`,
    `身份：${userData.identity || '未填写'}，年级：${userData.grade || '未填写'}，地区：${userData.region || '未填写'}`,
    `画像：学习/基础${profile.learningAbility}，技术/工具${profile.techAbility}，表达${profile.expressionAbility}，项目/整理${profile.projectAbility}，数据/判断${profile.dataAbility}，综合准备${profile.careerAbility}`
  ]
  if (recommendations.majors && recommendations.majors.length) lines.push(`${copy.majorLabel || '推荐专业'}：${recommendations.majors.map((i) => i.name).join('、')}`)
  if (recommendations.jobs && recommendations.jobs.length) lines.push(`${copy.jobLabel || '推荐岗位'}：${recommendations.jobs.map((i) => i.name).join('、')}`)
  if (recommendations.projects && recommendations.projects.length) lines.push(`${copy.projectLabel || '推荐项目'}：${recommendations.projects.map((i) => i.title).join('、')}`)
  if (recommendations.path) lines.push(`${copy.pathLabel}：${recommendations.path.name}，阶段：${(recommendations.path.stages || []).join(' -> ')}`)
  lines.push(copy.advice)
  lines.push('免责声明：本系统生成的推荐结果仅作为学习规划、志愿参考、就业方向和项目选题辅助，不构成最终录取、就业或竞赛结果承诺。')
  report.text = lines.join('\n')
  return report
}
module.exports = { generateReport }
