function showLoading(title = '处理中') {
  wx.showLoading({ title, mask: true })
}

function hideLoading() {
  wx.hideLoading()
}

function showError(message = '操作失败，请稍后重试') {
  wx.showToast({ title: message, icon: 'none' })
}

function handleCloudError(error = {}) {
  const message = error.errMsg || error.message || '云服务暂时不可用'
  if (/permission|auth|denied/i.test(message)) return '当前无权限访问该数据'
  if (/timeout|network|fail/i.test(message)) return '网络异常，请稍后重试'
  return message.length > 18 ? '服务异常，请稍后重试' : message
}

function safeCall(fn, options = {}) {
  const { loadingTitle, successMessage, errorMessage, finallyFn } = options
  if (loadingTitle) showLoading(loadingTitle)
  return Promise.resolve()
    .then(fn)
    .then((res) => {
      if (successMessage) wx.showToast({ title: successMessage, icon: 'success' })
      return res
    })
    .catch((error) => {
      showError(errorMessage || handleCloudError(error))
      return null
    })
    .finally(() => {
      if (loadingTitle) hideLoading()
      if (finallyFn) finallyFn()
    })
}

module.exports = {
  safeCall,
  showError,
  showLoading,
  hideLoading,
  handleCloudError
}
