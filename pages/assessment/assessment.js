const { generateProfile } = require('../../utils/profile')
const { recommendMajors, recommendJobs, recommendProjects, recommendLearningPath } = require('../../utils/recommend')
const { saveAssessment } = require('../../utils/storage')

const identityTabs = [
  { name: '高中生', desc: '高考升学' },
  { name: '大学生', desc: '竞赛/成长' },
  { name: '求职者', desc: '岗位求职' }
]

const identityDefaultPlan = {
  高中生: 'gaokao',
  大学生: 'competition',
  求职者: 'career'
}

const planTabsByIdentity = {
  高中生: [{ key: 'gaokao', label: '高考升学测评' }],
  大学生: [
    { key: 'competition', label: '竞赛选题测评' },
    { key: 'growth', label: '大学成长规划' }
  ],
  求职者: [{ key: 'career', label: '求职规划测评' }]
}

const assessmentConfigs = {
  gaokao: {
    title: '高考升学规划测评',
    desc: '围绕分数位次、科类批次、专业兴趣和城市偏好，生成高考后志愿规划建议。',
    steps: ['升学信息', '专业兴趣', '志愿准备度', '填报目标', '志愿偏好'],
    interestGroups: [
      { title: '信息与智能', desc: '适合理科基础较好、喜欢系统和逻辑的学生', options: ['软件开发', '人工智能', '数据分析', '网络安全', '物联网', '电子信息', '自动化', '智能制造'] },
      { title: '医学与生命健康', desc: '关注医学、健康服务、生命科学与信息化交叉', options: ['临床医学', '口腔医学', '医学信息', '护理康复', '药学', '生物技术', '医疗健康', '心理学'] },
      { title: '师范文法与公共服务', desc: '偏表达、教育、公共管理、法律和社会议题', options: ['教育服务', '师范教育', '法学社科', '公共管理', '新闻传播', '汉语言文学', '外语翻译', '社会工作'] },
      { title: '财经管理与数字商业', desc: '关注商业、平台运营、财务和数据决策', options: ['电子商务', '财务管理', '金融科技', '工商管理', '会计审计', '数字营销', '创新创业', '信息管理'] },
      { title: '设计传媒与绿色发展', desc: '适合创意表达、文化传播、城乡与生态方向', options: ['数字媒体', '视觉设计', '建筑规划', '农业环保', '新能源', '环境工程', '乡村振兴', '文化传播'] }
    ],
    goalOptions: ['稳妥录取', '冲刺院校', '专业优先', '城市优先', '深造潜力', '就业前景'],
    abilityFields: [
      { key: 'math', label: '优势科目稳定度' },
      { key: 'data', label: '分数位次理解度' },
      { key: 'expression', label: '专业兴趣清晰度' },
      { key: 'practice', label: '院校资料整理度' },
      { key: 'team', label: '家庭沟通充分度' },
      { key: 'programming', label: '志愿梯度意识' }
    ]
  },
  competition: {
    title: '大学生竞赛选题测评',
    desc: '只围绕国创、挑战杯、互联网+等比赛，评估选题、调研、原型、团队和答辩准备。',
    steps: ['项目信息', '选题方向', '项目准备度', '参赛目标', '资源条件'],
    interestGroups: [
      { title: 'AI与数据应用', desc: '适合做算法应用、数据看板、推荐和智能助手', options: ['人工智能', '数据分析', 'AI 助手', '知识图谱', '文本分析', '图像识别', '岗位匹配', '学习路径'] },
      { title: '教育与校园服务', desc: '校园调研便利，适合快速做出可验证原型', options: ['教育服务', '校园服务', '学习资源', '心理健康', '成长预警', '校园二手', '志愿服务', '无障碍服务'] },
      { title: '国家战略与社会议题', desc: '更贴合国创、挑战杯、互联网+的政策叙事', options: ['乡村振兴', '绿色低碳', '智慧养老', '医疗健康', '数字中国', '农业环保', '文化数字化', '社区治理'] },
      { title: '商业与创业实践', desc: '适合商业计划书、互联网+、创业训练项目', options: ['创新创业', '电子商务', '县域电商', '数字营销', '商业模式', '用户增长', '财务测算', '路演表达'] }
    ],
    goalOptions: ['国创立项', '挑战杯', '互联网+', '商业计划书', '原型作品', '结题答辩'],
    abilityFields: [
      { key: 'programming', label: '原型/作品基础' },
      { key: 'data', label: '数据来源可获得' },
      { key: 'math', label: '方案论证能力' },
      { key: 'practice', label: '落地执行能力' },
      { key: 'team', label: '团队分工清晰度' },
      { key: 'expression', label: '路演表达准备' }
    ]
  },
  growth: {
    title: '大学成长规划测评',
    desc: '面向大学阶段的课程、项目、考研/保研和作品积累，不涉及高中志愿和求职薪资。',
    steps: ['在校信息', '成长方向', '成长基础', '阶段目标', '学习安排'],
    interestGroups: [
      { title: '课程与升学', desc: '把绩点、考研、保研和专业课基础排清楚', options: ['专业基础', '绩点提升', '考研升学', '保研准备', '专业课补强', '英语提升', '数学基础', '文献阅读'] },
      { title: '科研与竞赛', desc: '适合想进实验室、做国创或参加比赛的学生', options: ['科研训练', '竞赛实践', '国创项目', '挑战杯', '数学建模', '论文入门', '调研报告', '项目管理'] },
      { title: '作品与能力', desc: '沉淀能展示的作品、技能和阶段复盘', options: ['作品集', '软件开发', '数据分析', '数字媒体', '产品原型', '演讲汇报', '协作执行', '复盘总结'] },
      { title: '探索与资源', desc: '适合方向还不清晰、想跨专业或找资源的人', options: ['跨专业探索', '社团实践', '创新创业', '导师沟通', '实习体验', '志愿服务', '校园资源', '时间管理'] }
    ],
    goalOptions: ['绩点提升', '考研准备', '保研准备', '科研入门', '竞赛积累', '作品集建设'],
    abilityFields: [
      { key: 'math', label: '课程基础稳定度' },
      { key: 'data', label: '资料检索能力' },
      { key: 'programming', label: '专业工具掌握' },
      { key: 'practice', label: '项目实践积累' },
      { key: 'team', label: '协作与执行' },
      { key: 'expression', label: '汇报表达能力' }
    ]
  },
  career: {
    title: '求职规划测评',
    desc: '只围绕岗位匹配、技能缺口、简历面试和投递策略，适合实习、校招和转行准备。',
    steps: ['求职信息', '岗位方向', '求职能力', '求职目标', '岗位偏好'],
    interestGroups: [
      { title: '技术研发岗', desc: '适合用项目和代码能力证明岗位匹配度', options: ['软件开发', 'Java 后端', '前端开发', '小程序开发', '软件测试', '运维', '数据库', '网络安全'] },
      { title: '数据与AI岗', desc: '适合用数据作品、模型应用和分析报告展示能力', options: ['数据分析', '人工智能', '算法助理', '数据产品', '商业分析', 'SQL', 'Python', '模型评测'] },
      { title: '产品设计运营岗', desc: '适合偏表达、用户理解、内容和增长的人', options: ['产品', '数字媒体', 'UI/UX', '新媒体运营', '内容运营', '用户运营', '教育产品', '电商运营'] },
      { title: '求职准备事项', desc: '把岗位目标拆成简历、作品、面试和投递动作', options: ['简历优化', '面试提升', '作品集', '实习投递', '校招求职', '转行准备', '岗位匹配', '职业定位'] }
    ],
    goalOptions: ['找实习', '校招求职', '转行准备', '简历优化', '面试提升', '职业定位'],
    abilityFields: [
      { key: 'programming', label: '岗位技能掌握' },
      { key: 'practice', label: '项目经历质量' },
      { key: 'expression', label: '简历表达能力' },
      { key: 'team', label: '协作沟通能力' },
      { key: 'data', label: '岗位信息分析' },
      { key: 'math', label: '学习补强能力' }
    ]
  }
}

function getConfig(planType) {
  return assessmentConfigs[planType] || assessmentConfigs.gaokao
}

function flattenInterestGroups(config) {
  return (config.interestGroups || [])
    .reduce((list, group) => list.concat(group.options || []), [])
}

function baseAbilities(config) {
  return config.abilityFields.reduce((next, item) => {
    next[item.key] = 3
    return next
  }, {})
}

function normalizeGoals(planType, goals) {
  const next = (goals || []).slice()
  if (planType === 'gaokao' && !next.includes('高考升学')) next.push('高考升学')
  if ((planType === 'competition' || planType === 'growth') && !next.includes('竞赛获奖')) next.push('竞赛获奖')
  if (planType === 'competition' && next.includes('商业计划书') && !next.includes('创业')) next.push('创业')
  if (planType === 'career' && !next.includes('就业')) next.push('就业')
  return next
}

function buildGaokaoPath(form) {
  return {
    id: 'path-gaokao',
    name: '高考后志愿规划',
    stages: [
      '核对本省一分一段、批次线和目标年份规则',
      '按位次建立冲、稳、保三档候选院校',
      '逐个核验专业培养方案、校区、选科和体检限制',
      '形成志愿草表，与家人完成风险确认'
    ],
    courses: ['阳光高考专业解读', '省考试院投档线', '目标院校招生章程'],
    practiceProjects: ['专业认知清单', '院校城市对比表', '志愿梯度表'],
    competitionAdvice: '先完成志愿和入学准备，录取后再结合专业选择竞赛或科研方向。'
  }
}

function buildCompetitionPath(form) {
  return {
    id: 'path-competition',
    name: form.planType === 'growth' ? '大学成长路线' : '竞赛项目推进',
    stages: form.planType === 'growth'
      ? ['整理课程短板和优势方向', '确定本学期主攻目标', '完成一个可展示作品或研究记录', '复盘绩点、项目和下一阶段安排']
      : ['完成用户访谈和需求证据', '确定选题边界与创新点', '做出MVP原型和数据样例', '准备申报书、路演稿和答辩材料'],
    courses: form.planType === 'growth' ? ['专业核心课', '科研方法入门', '项目管理'] : ['项目管理', '用户调研', '商业计划书写作'],
    practiceProjects: form.planType === 'growth' ? ['课程作品集', '文献阅读卡片', '阶段复盘报告'] : ['问卷访谈记录', '原型Demo', '项目计划书'],
    competitionAdvice: form.planType === 'growth' ? '先把课程、项目和升学目标排清楚，再选择适合自己的竞赛。' : '选题必须有真实需求、可展示成果、可验证数据和清晰团队分工。'
  }
}

Page({
  data: {
    step: 0,
    totalSteps: 5,
    identityTabs,
    planTabs: planTabsByIdentity.高中生,
    planType: 'gaokao',
    currentConfig: assessmentConfigs.gaokao,
    steps: assessmentConfigs.gaokao.steps,
    identityOptions: identityTabs.map((item) => item.name),
    interestGroups: assessmentConfigs.gaokao.interestGroups,
    interestOptions: flattenInterestGroups(assessmentConfigs.gaokao),
    goalOptions: assessmentConfigs.gaokao.goalOptions,
    levelOptions: ['低', '中', '中高', '高'],
    difficultyOptions: ['中', '中高', '高'],
    abilityFields: assessmentConfigs.gaokao.abilityFields,
    form: {
      identity: '高中生',
      planType: 'gaokao',
      grade: '',
      major: '',
      region: '',
      examProvince: '',
      subjectType: '',
      score: '',
      rank: '',
      projectExperience: '',
      resources: '',
      skills: '',
      interests: [],
      abilities: baseAbilities(assessmentConfigs.gaokao),
      goals: [],
      preferences: {}
    }
  },
  onShow() {
    const app = getApp()
    const identity = app.globalData.currentIdentity
    const planType = app.globalData.currentPlanType
    if (identity && (identity !== this.data.form.identity || planType)) {
      this.applyAssessment(identity, planType || identityDefaultPlan[identity] || 'gaokao', true)
      app.globalData.currentPlanType = ''
    }
  },
  applyAssessment(identity, planType, resetSelections) {
    const safeIdentity = identity || '高中生'
    const allowedTabs = planTabsByIdentity[safeIdentity] || planTabsByIdentity.高中生
    const safePlan = allowedTabs.some((item) => item.key === planType) ? planType : allowedTabs[0].key
    const config = getConfig(safePlan)
    const updates = {
      step: 0,
      planType: safePlan,
      planTabs: allowedTabs,
      currentConfig: config,
      steps: config.steps,
      interestGroups: config.interestGroups,
      interestOptions: flattenInterestGroups(config),
      goalOptions: config.goalOptions,
      abilityFields: config.abilityFields,
      'form.identity': safeIdentity,
      'form.planType': safePlan
    }
    if (resetSelections) {
      updates['form.interests'] = []
      updates['form.goals'] = []
      updates['form.preferences'] = {}
      updates['form.abilities'] = baseAbilities(config)
    }
    this.setData(updates)
  },
  onIdentityTap(e) {
    const identity = e.currentTarget.dataset.name
    getApp().globalData.currentIdentity = identity
    this.applyAssessment(identity, identityDefaultPlan[identity], true)
  },
  onThemeTap(e) {
    this.applyAssessment(this.data.form.identity, e.currentTarget.dataset.key, true)
  },
  onInput(e) { this.setData({ [`form.${e.currentTarget.dataset.key}`]: e.detail.value }) },
  onIdentity(e) {
    const identity = this.data.identityOptions[e.detail.value]
    this.applyAssessment(identity, identityDefaultPlan[identity], true)
  },
  onInterests(e) { this.setData({ 'form.interests': e.detail }) },
  onGoals(e) { this.setData({ 'form.goals': e.detail }) },
  setAbility(e) { this.setData({ [`form.abilities.${e.currentTarget.dataset.key}`]: Number(e.currentTarget.dataset.value) }) },
  onPref(e) { this.setData({ [`form.preferences.${e.currentTarget.dataset.key}`]: e.detail.value }) },
  onPrefPick(e) {
    const key = e.currentTarget.dataset.key
    const source = key === 'difficulty' ? this.data.difficultyOptions : this.data.levelOptions
    this.setData({ [`form.preferences.${key}`]: source[e.detail.value] })
  },
  next() { this.setData({ step: Math.min(this.data.totalSteps - 1, this.data.step + 1) }) },
  prev() { this.setData({ step: Math.max(0, this.data.step - 1) }) },
  goAssistant() { wx.navigateTo({ url: '/pages/assistant/assistant' }) },
  submit() {
    const planType = this.data.planType
    const config = getConfig(planType)
    const userData = {
      ...this.data.form,
      planType,
      planLabel: config.title,
      goals: normalizeGoals(planType, this.data.form.goals),
      displayGoals: this.data.form.goals,
      id: `a_${Date.now()}`,
      createdAt: new Date().toLocaleString()
    }
    const profile = generateProfile(userData)
    const jobs = planType === 'career' ? recommendJobs(userData, profile) : []
    const recommendations = {
      planType,
      majors: planType === 'gaokao' ? recommendMajors(userData, profile) : [],
      jobs,
      projects: planType === 'competition' || planType === 'growth' ? recommendProjects(userData, profile) : [],
      path: planType === 'gaokao'
        ? buildGaokaoPath(userData)
        : planType === 'career'
          ? recommendLearningPath(userData, profile, jobs[0])
          : buildCompetitionPath(userData)
    }
    saveAssessment({ ...userData, profile, recommendations })
    wx.setStorageSync('currentSolution', { userData, profile, recommendations })
    wx.switchTab({ url: '/pages/solution/solution' })
  }
})
