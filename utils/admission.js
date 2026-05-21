function toNumber(value) {
  const n = Number(String(value || '').replace(/[^\d.]/g, ''))
  return Number.isNaN(n) ? 0 : n
}

function parseAdmissionText(text = '') {
  const rows = []
  text.split(/\n+/).forEach((line) => {
    const clean = line.replace(/\s+/g, ' ').trim()
    if (!clean) return
    const numbers = clean.match(/\d{2,7}/g) || []
    if (numbers.length < 2) return
    const schoolMatch = clean.match(/[\u4e00-\u9fa5A-Za-z（）()·]{4,}/)
    const school = schoolMatch ? schoolMatch[0].replace(/[（(].*?[）)]/g, '') : ''
    if (!school) return
    const score = toNumber(numbers[0])
    const rank = toNumber(numbers[numbers.length - 1])
    if (score > 0 && rank > 0) rows.push({ school, score, rank, raw: clean })
  })
  return rows
}

function classifyByRank(studentRank, schoolRank) {
  if (!studentRank || !schoolRank) return { level: '待判断', color: '#64748b', reason: '缺少有效位次' }
  const ratio = studentRank / schoolRank
  if (ratio <= 0.88) return { level: '保', color: '#22c55e', reason: '你的位次明显优于往届最低位次' }
  if (ratio <= 1.03) return { level: '稳', color: '#1677ff', reason: '你的位次接近或略优于往届最低位次' }
  if (ratio <= 1.18) return { level: '冲', color: '#f59e0b', reason: '你的位次略低于往届最低位次，需要结合招生计划变化判断' }
  return { level: '风险', color: '#ef4444', reason: '你的位次与往届最低位次差距较大' }
}

function analyzeAdmission(form = {}, rows = []) {
  const studentRank = toNumber(form.rank)
  return rows.map((item) => {
    const result = classifyByRank(studentRank, item.rank)
    return {
      ...item,
      level: result.level,
      color: result.color,
      reason: result.reason,
      rankGap: item.rank - studentRank
    }
  }).sort((a, b) => {
    const order = { '稳': 1, '保': 2, '冲': 3, '风险': 4, '待判断': 5 }
    return (order[a.level] || 9) - (order[b.level] || 9)
  })
}

module.exports = { parseAdmissionText, analyzeAdmission, classifyByRank }
