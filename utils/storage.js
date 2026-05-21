const { key: prefixedKey } = require('./store')

function getList(key) { return wx.getStorageSync(key) || wx.getStorageSync(prefixedKey(key)) || [] }
function setList(key, list) { wx.setStorageSync(key, list); wx.setStorageSync(prefixedKey(key), list) }
function saveAssessment(item) { const list = getList('assessments'); list.unshift(item); setList('assessments', list); return list }
function getAssessments() { return getList('assessments') }
function saveReport(item) { const list = getList('reports'); list.unshift(item); setList('reports', list); return list }
function getReports() { return getList('reports') }
function saveFavorite(item) {
  const list = getList('favorites')
  if (!list.find((v) => v.id === item.id && v.type === item.type)) list.unshift(item)
  setList('favorites', list)
  return list
}
function getFavorites() { return getList('favorites') }
function removeFavorite(id, type) { const list = getList('favorites').filter((i) => !(i.id === id && i.type === type)); setList('favorites', list); return list }
function clearHistory() { setList('assessments', []); setList('reports', []) }
module.exports = { saveAssessment, getAssessments, saveReport, getReports, saveFavorite, getFavorites, removeFavorite, clearHistory }
