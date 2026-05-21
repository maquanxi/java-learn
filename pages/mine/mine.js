function getUserProfile() {
  return wx.getStorageSync('userProfile') || {}
}

function saveUserProfile(profile) {
  wx.setStorageSync('userProfile', profile)
}

Page({
  data: {
    avatarUrl: '',
    nickName: '学涯智航用户',
    assessmentCount: 0,
    reportCount: 0,
    favoriteCount: 0,
    menus: [
      { title: '历史测评', url: '/pages/history/history' },
      { title: '我的报告', url: '/pages/report/report' },
      { title: '我的收藏', url: '/pages/favorite/favorite' },
      { title: 'AI 数据助手', url: '/pages/assistant/assistant' },
      { title: '关于我们', url: '/pages/about/about' },
      { title: '反馈建议', url: '/pages/about/about?from=feedback' }
    ]
  },
  onShow() {
    const profile = getUserProfile()
    this.setData({
      avatarUrl: profile.avatarUrl || '',
      nickName: profile.nickName || '学涯智航用户',
      assessmentCount: (wx.getStorageSync('assessments') || []).length,
      reportCount: (wx.getStorageSync('reports') || []).length,
      favoriteCount: (wx.getStorageSync('favorites') || []).length
    })
  },
  onChooseAvatar(e) {
    const avatarUrl = e.detail.avatarUrl
    if (!avatarUrl) return
    const applyAvatar = (url) => {
      const profile = { ...getUserProfile(), avatarUrl: url }
      saveUserProfile(profile)
      this.setData({ avatarUrl: url })
      wx.showToast({ title: '头像已更新', icon: 'success' })
    }
    if (wx.saveFile) {
      wx.saveFile({
        tempFilePath: avatarUrl,
        success: (res) => applyAvatar(res.savedFilePath || avatarUrl),
        fail: () => applyAvatar(avatarUrl)
      })
      return
    }
    applyAvatar(avatarUrl)
  },
  resetAvatar() {
    const profile = { ...getUserProfile(), avatarUrl: '' }
    saveUserProfile(profile)
    this.setData({ avatarUrl: '' })
    wx.showToast({ title: '已恢复默认', icon: 'success' })
  },
  go(e) { wx.navigateTo({ url: e.currentTarget.dataset.url }) }
})
