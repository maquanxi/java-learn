const { clearXueyaStorage } = require('../../utils/store')
const { safeCall } = require('../../utils/error-handler')

Page({
  data: {
    items: [
      { title: '收集目的', desc: '仅用于生成升学、竞赛、求职相关测评结果、规划报告、历史记录和收藏内容。' },
      { title: '收集范围', desc: '身份阶段、专业背景、兴趣方向、能力评分、目标偏好、测评记录、收藏记录和用户主动填写的补充信息。' },
      { title: '使用边界', desc: '推荐和 AI 建议均为学习规划参考，不代表官方录取、就业或竞赛结果。' },
      { title: '数据控制', desc: '你可以在本页清除本地数据；云端数据删除需通过云函数按当前用户 openid 执行。' }
    ]
  },
  accept() {
    wx.setStorageSync('privacyAccepted', true)
    wx.showToast({ title: '已同意', icon: 'success' })
    setTimeout(() => wx.navigateBack({ delta: 1 }), 500)
  },
  clearLocal() {
    wx.showModal({
      title: '清除本地数据',
      content: '将清除本机测评、报告、收藏和头像缓存，是否继续？',
      success: (res) => {
        if (!res.confirm) return
        clearXueyaStorage()
        wx.showToast({ title: '已清除', icon: 'success' })
      }
    })
  },
  deleteCloud() {
    wx.showModal({
      title: '删除云端数据',
      content: '将尝试删除当前用户云端测评、报告、收藏和推荐反馈。请确认已登录微信云开发环境。',
      success: (res) => {
        if (!res.confirm) return
        safeCall(() => wx.cloud.callFunction({ name: 'deleteUserData' }), {
          loadingTitle: '删除中',
          successMessage: '已提交删除',
          errorMessage: '云端删除失败'
        })
      }
    })
  }
})
