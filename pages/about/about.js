Page({
  data: {
    from: '',
    values: [
      { title: '真实', desc: '尽量使用官方入口、公开数据和可核验信息，不把不确定结论包装成承诺。' },
      { title: '清晰', desc: '把高考、竞赛、求职三个场景分开，让用户知道自己正在做哪一种决策。' },
      { title: '可执行', desc: '每一次测评都沉淀为清单、路径、材料和下一步动作。' }
    ],
    services: [
      { title: '高考升学', desc: '围绕分数位次、专业认知、城市偏好和冲稳保梯度，帮助学生完成志愿前准备。' },
      { title: '竞赛选题', desc: '围绕国创、挑战杯、互联网+等比赛，帮助团队找到可调研、可落地、可答辩的方向。' },
      { title: '求职规划', desc: '围绕目标岗位、技能缺口、简历项目和面试表达，帮助用户形成求职补强路径。' }
    ],
    promises: ['不混淆测评场景', '不承诺录取或就业结果', '不强制依赖付费接口', '优先给出可核验来源和可执行建议'],
    contacts: [
      { label: '合作咨询', value: '面向学校、机构和团队提供场景化部署沟通' },
      { label: '产品反馈', value: '欢迎反馈测评题目、推荐结果和页面体验问题' },
      { label: '数据建议', value: '可提交官方来源、院校数据、赛事资料和岗位样本建议' }
    ]
  },
  onLoad(query = {}) {
    this.setData({ from: query.from || '' })
    wx.setNavigationBarTitle({ title: query.from === 'feedback' ? '反馈建议' : '关于我们' })
  },
  copyBrand() {
    wx.setClipboardData({ data: '学涯智航' })
  }
})
