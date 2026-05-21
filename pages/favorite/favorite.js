const { getFavorites, removeFavorite } = require('../../utils/storage')
Page({
  data: { favorites: [], typeMap: { major:'专业', job:'岗位', project:'国创选题', path:'学习路径' } },
  onShow() { this.setData({ favorites: getFavorites() }) },
  remove(e) {
    this.setData({ favorites: removeFavorite(e.currentTarget.dataset.id, e.currentTarget.dataset.type) })
    wx.showToast({ title: '已取消', icon: 'success' })
  }
})
