const { saveFavorite } = require('../../utils/storage')
const { generateReport } = require('../../utils/report')
const { images } = require('../../data/sourceConfig')

const solutionMeta = {
  gaokao: {
    title: '高考升学方案已生成',
    sub: '只展示志愿填报、专业认知和高考后规划。',
    scoreTitle: '志愿准备度',
    majorTitle: '推荐专业/志愿方向',
    pathTitle: '高考后规划',
    tipLabel: '录取后建议',
    profileBars: [
      ['学科优势', 'learningAbility'],
      ['位次判断', 'dataAbility'],
      ['专业认知', 'expressionAbility'],
      ['志愿准备', 'projectAbility']
    ]
  },
  competition: {
    title: '竞赛选题方案已生成',
    sub: '只展示竞赛选题、项目论证和参赛推进。',
    scoreTitle: '项目成熟度',
    projectTitle: '推荐竞赛/国创选题',
    pathTitle: '项目推进路径',
    tipLabel: '参赛建议',
    profileBars: [
      ['选题判断', 'dataAbility'],
      ['原型基础', 'techAbility'],
      ['执行落地', 'projectAbility'],
      ['路演表达', 'expressionAbility']
    ]
  },
  growth: {
    title: '大学成长方案已生成',
    sub: '围绕课程、项目、升学和作品积累做阶段规划。',
    scoreTitle: '成长准备度',
    projectTitle: '推荐成长项目',
    pathTitle: '成长路径',
    tipLabel: '阶段建议',
    profileBars: [
      ['课程基础', 'learningAbility'],
      ['资料检索', 'dataAbility'],
      ['项目积累', 'projectAbility'],
      ['表达复盘', 'expressionAbility']
    ]
  },
  career: {
    title: '求职规划方案已生成',
    sub: '只展示岗位匹配、技能缺口和求职路径。',
    scoreTitle: '岗位匹配度',
    jobTitle: '推荐就业岗位',
    pathTitle: '求职学习路径',
    tipLabel: '求职建议',
    profileBars: [
      ['岗位技能', 'techAbility'],
      ['简历表达', 'expressionAbility'],
      ['项目质量', 'projectAbility'],
      ['职业竞争力', 'careerAbility']
    ]
  }
}

function getMeta(planType) {
  return solutionMeta[planType] || solutionMeta.gaokao
}

Page({
  data: {
    images,
    solution: null,
    profile: {},
    recommendations: {},
    avgScore: 0,
    pathCoursesText: '',
    pathProjectsText: '',
    meta: solutionMeta.gaokao,
    profileBars: [],
    showMajors: false,
    showJobs: false,
    showProjects: false
  },
  onShow() {
    const solution = wx.getStorageSync('currentSolution')
    if (!solution) return this.setData({ solution: null })
    const recommendations = solution.recommendations || { majors: [], jobs: [], projects: [] }
    const all = [
      ...(recommendations.majors || []),
      ...(recommendations.jobs || []),
      ...(recommendations.projects || [])
    ]
    const avgScore = all.length ? Math.round(all.reduce((sum, item) => sum + (item.match || 0), 0) / all.length) : 0
    const planType = solution.userData.planType || recommendations.planType || 'gaokao'
    const meta = getMeta(planType)
    const path = recommendations.path || {}
    this.setData({
      solution,
      profile: solution.profile,
      recommendations,
      avgScore,
      meta,
      profileBars: meta.profileBars.map((item) => ({ label: item[0], value: solution.profile[item[1]] || 0 })),
      showMajors: !!(recommendations.majors && recommendations.majors.length),
      showJobs: !!(recommendations.jobs && recommendations.jobs.length),
      showProjects: !!(recommendations.projects && recommendations.projects.length),
      pathCoursesText: (path.courses || []).join('、'),
      pathProjectsText: (path.practiceProjects || []).join('、')
    })
  },
  favorite(e) {
    saveFavorite(e.detail)
    wx.showToast({ title: '已收藏', icon: 'success' })
  },
  favoriteAll() {
    const r = this.data.recommendations
    ;[
      ...(r.majors || []),
      ...(r.jobs || []),
      ...(r.projects || []),
      { ...(r.path || {}), type: 'path', match: this.data.avgScore }
    ].forEach(saveFavorite)
    wx.showToast({ title: '方案已收藏', icon: 'success' })
  },
  generateReport() {
    const s = this.data.solution
    const report = generateReport(s.userData, s.profile, s.recommendations)
    wx.setStorageSync('currentReport', report)
    wx.navigateTo({ url: '/pages/report/report' })
  },
  goProfile() { wx.navigateTo({ url: '/pages/profile/profile' }) },
  goAssistant() { wx.navigateTo({ url: '/pages/assistant/assistant' }) },
  restart() { wx.switchTab({ url: '/pages/assessment/assessment' }) }
})
