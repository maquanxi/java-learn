function validRows(list = []) {
  return list.filter((item) => item.rank && item.rank.rank)
}

function average(nums) {
  if (!nums.length) return 0
  return Math.round(nums.reduce((sum, item) => sum + item, 0) / nums.length)
}

function buildRankTrendAdvice(form = {}, rankYears = []) {
  const rows = validRows(rankYears)
  const missingCount = rankYears.filter((item) => !item.rank).length
  const currentYear = new Date().getFullYear()
  const beforeRelease = Number(form.targetYear) === currentYear && new Date().getMonth() < 5
  if (!rows.length) {
    return [
      `已收到 ${form.province || '本省'} ${form.subjectType || ''} ${form.score || ''} 分查询请求。`,
      beforeRelease ? `${currentYear} 年一分一段表通常要在高考成绩公布后发布，当前时间可能尚未有官方数据。` : '',
      '目前没有自动解析到近五年一分一段表。请复制省教育考试院发布的“一分一段表”文本粘贴到输入框，系统会立即反查位次并生成分析。',
      '正式填报时必须以本省教育考试院发布的当年一分一段表和投档线为准。'
    ].filter(Boolean).join('\n')
  }
  const ranks = rows.map((item) => item.rank.rank)
  const best = rows.reduce((a, b) => a.rank.rank < b.rank.rank ? a : b)
  const worst = rows.reduce((a, b) => a.rank.rank > b.rank.rank ? a : b)
  const avg = average(ranks)
  const latest = rows[0]
  const spread = worst.rank.rank - best.rank.rank
  const volatility = spread > avg * 0.18 ? '波动较大' : spread > avg * 0.08 ? '有一定波动' : '相对稳定'
  const direction = latest.rank.rank <= avg ? '今年/目标年份位次处于近年均值以内，竞争位置相对有利。' : '今年/目标年份位次低于近年均值，需要适当增加稳妥和保底院校。'
  return [
    `${form.province || '本省'} ${form.subjectType || ''} ${form.score || ''} 分近年同分位次已完成比对。`,
    beforeRelease ? `${currentYear} 年一分一段表可能尚未发布，当前分析会优先使用已能解析到的历史年份。` : '',
    `近 ${rows.length} 年可解析数据的平均位次约为 ${avg} 名，最好位次为 ${best.year} 年 ${best.rank.rank} 名，最低位次为 ${worst.year} 年 ${worst.rank.rank} 名，整体${volatility}。`,
    missingCount ? `另有 ${missingCount} 个年份因官网图片/PDF或反爬限制未自动解析，可在省教育考试院下载一分一段表后粘贴导入。` : '',
    direction,
    '志愿策略建议：用“位次”而不是单纯分数对照院校。冲刺院校可参考高于当前位次 5%-12% 的往年最低位次，稳妥院校参考上下 5% 区间，保底院校建议留出 12%-20% 的位次安全边际。',
    'AI 助手提醒：如果今年招生计划、选科要求、专业组或批次规则变化明显，需要把往年位次作为参考区间，而不是绝对结论。'
  ].filter(Boolean).join('\n')
}

module.exports = { buildRankTrendAdvice }
