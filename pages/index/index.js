const { images } = require('../../data/sourceConfig')
const { directionNames, getHotDirection } = require('../../data/hotDirections')

const identityPlanMap = {
  高中生: 'gaokao',
  大学生: 'competition',
  求职者: 'career'
}

function chunk(list, size) {
  const groups = []
  for (let i = 0; i < list.length; i += size) groups.push(list.slice(i, i + size))
  return groups
}

Page({
  data: {
    images,
    identities: [
      { name: '高中生', desc: '只进入高考升学、位次与志愿规划', icon: '高' },
      { name: '大学生', desc: '只进入竞赛选题、国创与成长项目', icon: '创' },
      { name: '求职者', desc: '只进入岗位匹配、简历与面试规划', icon: '职' }
    ],
    serviceCards: [
      {
        key: 'gaokao',
        identity: '高中生',
        planType: 'gaokao',
        title: '高考升学',
        desc: '分数位次、冲稳保梯度、专业认知',
        summary: '面向高三和高考出分后的学生，把分数、位次、科类、城市、专业兴趣和家庭偏好放在同一张规划表里判断。',
        points: ['核验省考试院与阳光高考信息', '建立冲稳保志愿梯度', '拆解专业课程、校区和限制条件'],
        outputs: ['专业兴趣清单', '院校城市对比表', '志愿风险提示', '高考后规划路径'],
        prepare: ['高考省份与科类', '分数/位次', '目标城市', '不能接受的专业或限制']
      },
      {
        key: 'competition',
        identity: '大学生',
        planType: 'competition',
        title: '竞赛选题',
        desc: '国创/挑战杯/互联网+选题与材料',
        summary: '面向大学生竞赛和国创申报，把选题方向、真实需求、数据来源、团队资源、原型成果和答辩表达串起来。',
        points: ['围绕国家战略和校园真实场景找题', '补齐需求调研、数据样例和MVP原型', '输出申报书与路演答辩准备清单'],
        outputs: ['可申报选题', '项目推进路线', '团队分工建议', '答辩材料要点'],
        prepare: ['专业/团队背景', '已有项目基础', '可用数据或场景', '目标赛事']
      },
      {
        key: 'career',
        identity: '求职者',
        planType: 'career',
        title: '求职规划',
        desc: '岗位技能、简历面试、学习补强',
        summary: '面向实习、校招、转行和应届求职，把目标岗位、已有技能、项目经历和投递偏好拆成可执行的补强路径。',
        points: ['从岗位JD反推技能缺口', '梳理简历项目和面试表达', '生成阶段学习与投递策略'],
        outputs: ['岗位匹配建议', '技能差距表', '简历优化方向', '面试准备路径'],
        prepare: ['目标城市', '已有技能', '项目/实习经历', '岗位或行业偏好']
      }
    ],
    hotGroups: chunk(directionNames(), 4),
    serviceDetail: null,
    hotDetail: null,
    lastReport: null
  },
  onShow() {
    const reports = wx.getStorageSync('reports') || []
    this.setData({ lastReport: reports[0] || null })
  },
  chooseIdentity(e) {
    const identity = e.currentTarget.dataset.name
    getApp().globalData.currentIdentity = identity
    getApp().globalData.currentPlanType = identityPlanMap[identity] || 'gaokao'
    wx.switchTab({ url: '/pages/assessment/assessment' })
  },
  openHot(e) {
    this.setData({ hotDetail: getHotDirection(e.currentTarget.dataset.name) })
  },
  openService(e) {
    const key = e.currentTarget.dataset.key
    const serviceDetail = this.data.serviceCards.find((item) => item.key === key)
    this.setData({ serviceDetail })
  },
  closeService() {
    this.setData({ serviceDetail: null })
  },
  startService() {
    const detail = this.data.serviceDetail
    if (!detail) return
    getApp().globalData.currentIdentity = detail.identity
    getApp().globalData.currentPlanType = detail.planType
    this.setData({ serviceDetail: null })
    wx.switchTab({ url: '/pages/assessment/assessment' })
  },
  closeHot() {
    this.setData({ hotDetail: null })
  },
  noop() {},
  askHotAi() {
    const detail = this.data.hotDetail
    if (!detail) return
    wx.setStorageSync('assistantPrefill', {
      mode: detail.mode || 'career',
      scene: '方向介绍',
      direction: detail.name,
      detail,
      form: {
        interests: detail.name
      },
      projectForm: {
        identity: '大学生',
        grade: '',
        major: detail.suitableMajors || '',
        interests: detail.name,
        resources: detail.requiredSkills.slice(0, 4).join('、')
      },
      careerForm: {
        education: '',
        city: '',
        skills: detail.requiredSkills.slice(0, 4).join('、'),
        interests: detail.roles[0],
        preference: `想了解${detail.name}方向的专业背景、优势和准备路径`
      }
    })
    wx.navigateTo({ url: '/pages/assistant/assistant' })
  },
  startAssessment() { wx.switchTab({ url: '/pages/assessment/assessment' }) },
  goAssistant() { wx.navigateTo({ url: '/pages/assistant/assistant' }) },
  goReport() { wx.navigateTo({ url: '/pages/report/report' }) }
})
