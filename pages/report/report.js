const { saveReport } = require('../../utils/storage')

const reportMeta = {
  gaokao: {
    profileTitle: '志愿准备画像',
    majorTitle: '推荐专业/志愿方向',
    pathTitle: '高考后规划',
    advice: '建议先核验省考试院一分一段、投档线和招生章程，再按冲稳保形成志愿草表。'
  },
  competition: {
    profileTitle: '竞赛准备画像',
    projectTitle: '推荐竞赛/国创选题',
    pathTitle: '项目推进路径',
    advice: '建议先补齐需求证据、项目原型、数据来源和团队分工，再打磨申报书与路演材料。'
  },
  growth: {
    profileTitle: '大学成长画像',
    projectTitle: '推荐成长项目',
    pathTitle: '大学成长路径',
    advice: '建议把课程、项目、升学和作品积累排成阶段目标，每月复盘一次。'
  },
  career: {
    profileTitle: '求职能力画像',
    jobTitle: '推荐就业岗位',
    pathTitle: '求职学习路径',
    advice: '建议用目标岗位JD反推技能缺口，补齐作品、简历表达和面试案例。'
  }
}

function getMeta(planType) {
  return reportMeta[planType] || reportMeta.gaokao
}

Page({
  data: {
    report: null,
    meta: reportMeta.gaokao,
    baseInfo: '',
    profileText: '',
    majorText: '',
    jobText: '',
    projectText: '',
    pathText: '',
    adviceText: '',
    showMajors: false,
    showJobs: false,
    showProjects: false
  },
  onShow() {
    const report = wx.getStorageSync('currentReport') || (wx.getStorageSync('reports') || [])[0]
    if (!report) return
    const u = report.userData
    const p = report.profile
    const r = report.recommendations
    const planType = u.planType || r.planType || 'gaokao'
    const meta = getMeta(planType)
    this.setData({
      report,
      meta,
      showMajors: !!(r.majors && r.majors.length),
      showJobs: !!(r.jobs && r.jobs.length),
      showProjects: !!(r.projects && r.projects.length),
      baseInfo: `测评主题:${u.planLabel || '未填写'}\n身份:${u.identity || '未填写'}\n年级:${u.grade || '未填写'}\n专业/意向:${u.major || '未填写'}\n地区:${u.region || '未填写'}\n高考省份:${u.examProvince || '未填写'}\n高考分数:${u.score || '未填写'}\n本省位次:${u.rank || '未填写'}`,
      profileText: `学习/基础 ${p.learningAbility}%\n技术/工具 ${p.techAbility}%\n表达 ${p.expressionAbility}%\n项目/整理 ${p.projectAbility}%\n数据/判断 ${p.dataAbility}%\n综合准备 ${p.careerAbility}%`,
      majorText: (r.majors || []).map((i) => `${i.name}:${i.match}%｜${i.reason}`).join('\n'),
      jobText: (r.jobs || []).map((i) => `${i.name}:${i.match}%｜${i.reason}`).join('\n'),
      projectText: (r.projects || []).map((i) => `${i.title}:${i.match}%｜${i.description}`).join('\n'),
      pathText: `${r.path.name}\n${(r.path.stages || []).join(' -> ')}\n参考资料/课程:${(r.path.courses || []).join('、')}`,
      adviceText: `${report.summary}\n\n${meta.advice}\n\n免责声明:本系统生成的推荐结果仅作为学习规划、志愿参考、就业方向和项目选题辅助,不构成最终录取、就业或竞赛结果承诺.`
    })
  },
  save() { saveReport(this.data.report); wx.showToast({ title: '已保存', icon: 'success' }) },
  copy() { wx.setClipboardData({ data: this.data.report.text }) },
  home() { wx.switchTab({ url: '/pages/index/index' }) }
})
