const { clearHistory } = require('../../utils/storage')
Page({
  data: { assessments: [], reports: [], activeTab: 'assessment' },
  onShow() { this.refresh() },
  refresh() { this.setData({ assessments: wx.getStorageSync('assessments') || [], reports: wx.getStorageSync('reports') || [] }) },
  switchTab(e) {
    this.setData({ activeTab: e.currentTarget.dataset.tab })
  },
  viewAssessment(e) {
    const item = this.data.assessments[e.currentTarget.dataset.index]
    wx.setStorageSync('currentSolution', { userData: item, profile: item.profile, recommendations: item.recommendations })
    wx.switchTab({ url: '/pages/solution/solution' })
  },
  viewReport(e) { wx.setStorageSync('currentReport', this.data.reports[e.currentTarget.dataset.index]); wx.navigateTo({ url: '/pages/report/report' }) },
  deleteAssessment(e) { const list = this.data.assessments; list.splice(e.currentTarget.dataset.index, 1); wx.setStorageSync('assessments', list); this.refresh() },
  deleteReport(e) { const list = this.data.reports; list.splice(e.currentTarget.dataset.index, 1); wx.setStorageSync('reports', list); this.refresh() },
  clear() { clearHistory(); this.refresh(); wx.showToast({ title: '已清空', icon: 'success' }) },
  goAssessment() { wx.switchTab({ url: '/pages/assessment/assessment' }) }
})
