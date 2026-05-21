const PREFIX = 'xueya_'
const listeners = []
const state = {
  currentAssessment: null,
  currentRecommendations: null,
  currentReport: null,
  userInfo: null
}

function key(name) { return `${PREFIX}${name}` }

function notify() {
  listeners.forEach((fn) => fn({ ...state }))
}

function getState(name) {
  return name ? state[name] : { ...state }
}

function setState(patch = {}, persistKeys = []) {
  Object.assign(state, patch)
  persistKeys.forEach((name) => wx.setStorageSync(key(name), state[name]))
  notify()
}

function subscribe(fn) {
  listeners.push(fn)
  return () => {
    const index = listeners.indexOf(fn)
    if (index >= 0) listeners.splice(index, 1)
  }
}

function persist(name, value) {
  state[name] = value
  wx.setStorageSync(key(name), value)
  notify()
}

function restore() {
  Object.keys(state).forEach((name) => {
    const value = wx.getStorageSync(key(name))
    if (value) state[name] = value
  })
  notify()
  return getState()
}

function clearXueyaStorage() {
  Object.keys(state).forEach((name) => {
    state[name] = null
    wx.removeStorageSync(key(name))
  })
  ;['assessments', 'reports', 'favorites', 'userProfile', 'privacyAccepted'].forEach((name) => {
    wx.removeStorageSync(name)
    wx.removeStorageSync(key(name))
  })
  notify()
}

module.exports = {
  PREFIX,
  key,
  getState,
  setState,
  subscribe,
  persist,
  restore,
  clearXueyaStorage
}
