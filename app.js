App({
  globalData: {
    appName: '学涯智航',
    version: 'V1.0',
    currentIdentity: '',
    currentPlanType: ''
  },
  onLaunch() {
    if (wx.cloud) {
      try {
        wx.cloud.init({ traceUser: true })
      } catch (e) {
        console.warn('云开发未启用,在线数据助手将使用页面端请求和官方入口兜底.')
      }
    }
    const initKeys = ['assessments', 'reports', 'favorites']
    initKeys.forEach((key) => {
      if (!wx.getStorageSync(key)) wx.setStorageSync(key, [])
    })
  }
})
