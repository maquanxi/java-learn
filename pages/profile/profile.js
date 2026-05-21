const profileMeta = {
  gaokao: {
    title: '志愿准备画像',
    desc: '围绕高考升学测评展示学科优势、位次判断、专业认知和志愿准备情况。',
    bars: [
      ['学科优势', 'learningAbility'],
      ['志愿梯度意识', 'techAbility'],
      ['专业兴趣清晰度', 'expressionAbility'],
      ['院校资料整理度', 'projectAbility'],
      ['分数位次理解度', 'dataAbility'],
      ['升学准备度', 'careerAbility']
    ]
  },
  competition: {
    title: '竞赛准备画像',
    desc: '围绕选题、调研、原型、团队和路演展示项目准备情况。',
    bars: [
      ['方案论证能力', 'learningAbility'],
      ['原型/作品基础', 'techAbility'],
      ['路演表达准备', 'expressionAbility'],
      ['落地执行能力', 'projectAbility'],
      ['数据来源可获得', 'dataAbility'],
      ['项目成熟度', 'careerAbility']
    ]
  },
  growth: {
    title: '大学成长画像',
    desc: '围绕课程基础、资料检索、项目积累和阶段复盘展示成长状态。',
    bars: [
      ['课程基础', 'learningAbility'],
      ['专业工具掌握', 'techAbility'],
      ['汇报表达能力', 'expressionAbility'],
      ['项目实践积累', 'projectAbility'],
      ['资料检索能力', 'dataAbility'],
      ['成长执行力', 'careerAbility']
    ]
  },
  career: {
    title: '求职能力画像',
    desc: '围绕岗位技能、项目经历、简历表达、信息分析和职业竞争力展示求职状态。',
    bars: [
      ['学习补强能力', 'learningAbility'],
      ['岗位技能掌握', 'techAbility'],
      ['简历表达能力', 'expressionAbility'],
      ['项目经历质量', 'projectAbility'],
      ['岗位信息分析', 'dataAbility'],
      ['职业竞争力', 'careerAbility']
    ]
  }
}

Page({
  data: { profile: {}, meta: profileMeta.gaokao, bars: [] },
  onShow() {
    const s = wx.getStorageSync('currentSolution') || {}
    const profile = s.profile || {}
    const planType = s.userData && s.userData.planType ? s.userData.planType : 'gaokao'
    const meta = profileMeta[planType] || profileMeta.gaokao
    this.setData({
      profile,
      meta,
      bars: meta.bars.map((item) => ({ label: item[0], value: profile[item[1]] || 0 }))
    })
  }
})
