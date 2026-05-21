function percent(n) { return `${Math.round(n || 0)}%` }
function dateText(value) { return value || new Date().toLocaleString() }
module.exports = { percent, dateText }
