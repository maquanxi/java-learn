const { images } = require('../../data/sourceConfig')
const { getProvinceNames, crawlAdmissionSources, crawlCompetitionSources, crawlCareerSources } = require('../../utils/sourceCrawler')
const { parseAdmissionText, analyzeAdmission } = require('../../utils/admission')
const { buildVolunteerAdvice, buildProjectAdvice, buildCareerAdvice } = require('../../utils/advisor')
const { queryFiveYearRanks, parseManualRankText } = require('../../utils/rankCrawler')
const { buildRankTrendAdvice } = require('../../utils/rankAdvisor')

function buildYearOptions() {
  const current = new Date().getFullYear()
  return Array.from({ length: 6 }).map((_, index) => String(current - index))
}

function withPrimarySource(item) {
  const primarySource = item && item.links && item.links.length ? item.links[0] : null
  return { ...item, primarySource }
}

function formatRankText(item) {
  if (!item || !item.rank) return '未命中官方精确行'
  if (item.rank.rankStart && item.rank.rankEnd) return `${item.year} 年 ${item.rank.rankStart}-${item.rank.rankEnd} 名`
  return `${item.year} 年 ${item.rank.rank} 名`
}

function decorateRankYear(item) {
  const next = withPrimarySource(item)
  const statusMap = {
    ok: '已命中',
    manual: '待导入',
    missing: '未命中',
    fail: '查询失败'
  }
  const rank = next.rank
  return {
    ...next,
    statusText: statusMap[next.status] || '待核验',
    displayRank: rank ? formatRankText(next) : '未录入精确行',
    displayMeta: rank
      ? `同分人数 ${rank.sameScorePeople || rank.sameScoreCount || '-'}，保守参考位次 ${rank.rank || rank.rankEnd || '-'}`
      : (next.message || '请导入省级考试院官方一分一段表。')
  }
}

Page({
  data: {
    images,
    mode: 'volunteer',
    modes: [
      { key: 'volunteer', label: '志愿填报' },
      { key: 'project', label: '选题比赛' },
      { key: 'career', label: '就业方向' }
    ],
    provinces: getProvinceNames(),
    subjectTypes: ['物理类/理科', '历史类/文科', '综合改革', '艺术类', '体育类'],
    yearOptions: buildYearOptions(),
    form: { province: '河南', subjectType: '物理类/理科', targetYear: String(new Date().getFullYear()), score: '', rank: '', interests: '' },
    projectForm: { identity: '大学生', grade: '', major: '', interests: '', resources: '' },
    careerForm: { education: '', city: '', skills: '', interests: '', preference: '' },
    admissionText: '',
    admissionResults: [],
    rankYears: [],
    rankMissingText: '',
    rankSummary: '',
    autoRankText: '待查询本地数据',
    rankImportOpen: false,
    sourceGroups: [],
    answer: '',
    loading: false,
    rankLoading: false,
    aiLoading: false,
    formCollapsed: false,
    chatMessages: [],
    chatInput: ''
  },
  onLoad() {
    const prefill = wx.getStorageSync('assistantPrefill')
    if (!prefill) return
    wx.removeStorageSync('assistantPrefill')
    const nextData = { mode: prefill.mode || this.data.mode }
    if (prefill.form) nextData.form = { ...this.data.form, ...prefill.form }
    if (prefill.careerForm) nextData.careerForm = { ...this.data.careerForm, ...prefill.careerForm }
    if (prefill.projectForm) nextData.projectForm = { ...this.data.projectForm, ...prefill.projectForm }
    this.setData(nextData, () => {
      if (prefill.scene === '专业方向介绍' || prefill.scene === '方向介绍') {
        const mode = prefill.mode || this.data.mode
        const localAnswer = mode === 'volunteer'
          ? buildVolunteerAdvice(this.data.form, [], [])
          : mode === 'project'
            ? buildProjectAdvice(this.data.projectForm, [])
            : buildCareerAdvice(this.data.careerForm, [])
        this.pushChat('user', `请帮我深度介绍${prefill.direction || ''}方向`)
        this.pushChat('assistant', localAnswer)
        this.setData({ formCollapsed: true })
        this.callAi([{ role: 'user', content: `场景:方向介绍\n本地分析:${localAnswer}\n用户数据:${JSON.stringify({ mode, form: mode === 'project' ? this.data.projectForm : mode === 'volunteer' ? this.data.form : this.data.careerForm, direction: prefill.direction, detail: prefill.detail })}` }])
      }
    })
  },
  switchMode(e) {
    this.setData({ mode: e.currentTarget.dataset.key, sourceGroups: [], answer: '', admissionResults: [], rankYears: [], rankSummary: '', rankMissingText: '', rankImportOpen: false })
  },
  onProvince(e) { this.setData({ 'form.province': this.data.provinces[e.detail.value] }) },
  onSubject(e) { this.setData({ 'form.subjectType': this.data.subjectTypes[e.detail.value] }) },
  onYear(e) { this.setData({ 'form.targetYear': this.data.yearOptions[e.detail.value] }) },
  onInput(e) { this.setData({ [`form.${e.currentTarget.dataset.key}`]: e.detail.value }) },
  onProjectInput(e) { this.setData({ [`projectForm.${e.currentTarget.dataset.key}`]: e.detail.value }) },
  onCareerInput(e) { this.setData({ [`careerForm.${e.currentTarget.dataset.key}`]: e.detail.value }) },
  onAdmissionText(e) { this.setData({ admissionText: e.detail.value }) },
  queryRank() {
    const form = this.data.form
    if (!form.score) {
      wx.showToast({ title: '请先填写分数', icon: 'none' })
      return
    }
    this.setData({ rankLoading: true, rankSummary: '', rankYears: [], autoRankText: '核验中', rankImportOpen: false })
    queryFiveYearRanks(form).then((rankYears) => {
      const current = rankYears.find((item) => String(item.year) === String(form.targetYear) && item.rank)
      const first = current || rankYears.find((item) => item.rank)
      const displayYears = rankYears.map(decorateRankYear)
      const parsedYears = displayYears.filter((item) => item.rank)
      const missingCount = displayYears.length - parsedYears.length
      const autoRankText = formatRankText(first)
      const rankSummary = buildRankTrendAdvice(form, rankYears)
      this.setData({
        rankYears: displayYears,
        rankMissingText: missingCount ? `${missingCount} 个年份未录入本地官方精确行。微信环境不稳定抓取考试院网页，建议打开官方入口核对后粘贴一分一段表文本导入。` : '',
        rankSummary,
        autoRankText: first && first.rank ? autoRankText : '需导入官方表',
        rankImportOpen: !first || !first.rank,
        rankLoading: false,
        'form.rank': first && first.rank ? first.rank.rank : ''
      })
    }).catch(() => {
      this.setData({ rankLoading: false, autoRankText: '需手动导入', rankImportOpen: true })
      wx.showToast({ title: '查询失败,请粘贴一分一段表', icon: 'none' })
    })
  },
  analyzeManualRank() {
    const form = this.data.form
    if (!form.score || !this.data.admissionText) {
      wx.showToast({ title: '请填写分数并粘贴表格', icon: 'none' })
      return
    }
    const result = parseManualRankText(this.data.admissionText, form.score, form.targetYear, form.subjectType)
    const rankYears = [decorateRankYear(result)].concat(this.data.rankYears.filter((item) => String(item.year) !== String(form.targetYear))).slice(0, 5)
    const rankSummary = buildRankTrendAdvice(form, rankYears)
    this.setData({
      rankYears,
      rankMissingText: '',
      rankSummary,
      autoRankText: result.rank ? `${form.targetYear} 年 ${result.rank.rank} 名` : '未识别',
      rankImportOpen: !result.rank,
      'form.rank': result.rank ? result.rank.rank : ''
    })
  },
  toggleRankImport() {
    this.setData({ rankImportOpen: !this.data.rankImportOpen })
  },
  syncSources() {
    const task = this.data.mode === 'volunteer'
      ? crawlAdmissionSources(this.data.form.province)
      : this.data.mode === 'project'
        ? crawlCompetitionSources()
        : crawlCareerSources()
    this.setData({ loading: true })
    task.then((groups) => {
      this.setData({ sourceGroups: groups, loading: false })
      wx.showToast({ title: '已加载官方线索', icon: 'success' })
    }).catch(() => {
      this.setData({ loading: false })
      wx.showToast({ title: '加载失败', icon: 'none' })
    })
  },

  // 推送一条聊天消息
  pushChat(role, content) {
    const chatMessages = this.data.chatMessages.concat([{ role, content }])
    this.setData({ chatMessages }, () => {
      wx.pageScrollTo({ scrollTop: 99999, duration: 300 })
    })
  },

  // 调用 AI 云函数（多轮对话）
  callAi(messages) {
    if (!wx.cloud || !wx.cloud.callFunction) return
    this.setData({ aiLoading: true })
    wx.cloud.callFunction({
      name: 'aiAdvisor',
      data: { messages },
      success: (res) => {
        const result = res.result || {}
        if (result.ok && result.answer) {
          // 附加搜索状态提示
          let answer = result.answer
          if (result.toolHits || result.azureHits || result.bingHits) {
            const tags = []
            if (result.toolHits) tags.push(`轻量工具 ${result.toolHits} 条`)
            if (result.azureHits) tags.push(`教育数据库 ${result.azureHits} 条`)
            if (result.bingHits) tags.push(`网络搜索 ${result.bingHits} 条`)
            answer += `\n\n— 已引用: ${tags.join('，')} —`
          }
          this.pushChat('assistant', answer)
        } else {
          this.pushChat('assistant', result.message || 'AI 服务暂时不可用，请稍后重试。')
        }
      },
      fail: () => {
        this.pushChat('assistant', '网络异常，AI 服务暂时不可用。')
      },
      complete: () => {
        this.setData({ aiLoading: false })
      }
    })
  },

  analyze() {
    const mode = this.data.mode
    let userMsg = ''
    let localAnswer = ''
    let scene = ''

    if (mode === 'volunteer') {
      const form = this.data.form
      userMsg = `【志愿填报分析请求】\n省份: ${form.province} | 科类: ${form.subjectType} | 分数: ${form.score} | 年份: ${form.targetYear}\n位次: ${form.rank || '未查'} | 偏好: ${form.interests || '无'}`
      if (this.data.admissionText) {
        const rows = parseAdmissionText(this.data.admissionText)
        const admissionResults = analyzeAdmission(form, rows)
        this.setData({ admissionResults })
        localAnswer = `${this.data.rankSummary || buildRankTrendAdvice(form, this.data.rankYears)}\n\n${buildVolunteerAdvice(form, admissionResults, this.data.sourceGroups)}`
      } else {
        localAnswer = `${this.data.rankSummary || buildRankTrendAdvice(form, this.data.rankYears)}\n\n${buildVolunteerAdvice(form, [], this.data.sourceGroups)}`
      }
      scene = '志愿填报'
    } else if (mode === 'project') {
      const form = this.data.projectForm
      userMsg = `【选题比赛共创请求】\n身份: ${form.identity} | 年级: ${form.grade}\n专业: ${form.major} | 方向: ${form.interests}\n资源: ${form.resources || '无'}`
      localAnswer = buildProjectAdvice(form, this.data.sourceGroups)
      scene = '选题比赛'
    } else {
      const form = this.data.careerForm
      userMsg = `【就业方向规划请求】\n学历: ${form.education} | 城市: ${form.city}\n技能: ${form.skills} | 目标: ${form.interests}\n偏好: ${form.preference || '无'}`
      localAnswer = buildCareerAdvice(form, this.data.sourceGroups)
      scene = '就业方向'
    }

    // 先展示本地分析结果
    this.pushChat('user', userMsg)
    this.pushChat('assistant', localAnswer)
    this.setData({ formCollapsed: true, answer: '' })

    // 再调用 AI 增强
    const chatHistory = this.data.chatMessages.map(m => ({ role: m.role, content: m.content }))
    chatHistory.push({ role: 'user', content: `场景:${scene}\n本地分析:${localAnswer}\n用户数据:${userMsg}` })
    this.callAi(chatHistory)
  },

  // 用户追问
  sendChat() {
    const input = (this.data.chatInput || '').trim()
    if (!input || this.data.aiLoading) return
    this.pushChat('user', input)
    this.setData({ chatInput: '' })

    const chatHistory = this.data.chatMessages.map(m => ({ role: m.role, content: m.content }))
    this.callAi(chatHistory)
  },

  onChatInput(e) {
    this.setData({ chatInput: e.detail.value })
  },

  toggleForm() {
    this.setData({ formCollapsed: !this.data.formCollapsed })
  },

  copyLink(e) {
    wx.setClipboardData({ data: e.currentTarget.dataset.url })
  }
})
