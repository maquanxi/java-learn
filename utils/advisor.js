const {
  officialPolicySources,
  pickProjectDirections,
  pickCareerDirection
} = require('../data/hotDirections')

function compactLinks(groups = []) {
  return groups.reduce((list, group) => {
    return list.concat((group.links || []).map((link) => `${link.title}：${link.url}`))
  }, []).slice(0, 6)
}

function compactOfficialSources(limit = 4) {
  return officialPolicySources
    .slice(0, limit)
    .map((item) => `${item.title}：${item.url}`)
}

function buildVolunteerAdvice(form, results, sourceGroups) {
  const lines = [
    `报考省份：${form.province || '未选择'}，科类：${form.subjectType || '未填写'}，分数：${form.score || '未填写'}，位次：${form.rank || '未填写'}。`
  ]
  if (results.length) {
    const safe = results.filter((item) => item.level === '保').slice(0, 3).map((item) => item.school)
    const stable = results.filter((item) => item.level === '稳').slice(0, 3).map((item) => item.school)
    const rush = results.filter((item) => item.level === '冲').slice(0, 3).map((item) => item.school)
    lines.push(`建议按“冲-稳-保”组合填报：冲刺 ${rush.join('、') || '待补充'}；稳妥 ${stable.join('、') || '待补充'}；保底 ${safe.join('、') || '待补充'}。`)
    lines.push('排序时优先使用同省同科类的最近三年最低位次，不要只看分数；如果招生计划缩减或专业组变化，需要下调预期。')
  } else {
    lines.push('还没有解析到院校投档线数据。请从省教育考试院或阳光高考复制“院校、最低分、最低位次”表格文本，粘贴后再分析。')
  }
  const sourceLines = compactLinks(sourceGroups)
  if (sourceLines.length) lines.push(`已抓取到的官方线索：${sourceLines.join('；')}`)
  lines.push('结论仅作为志愿辅助，不构成录取承诺。')
  return lines.join('\n')
}

function buildProjectAdvice(form, sourceGroups) {
  const interests = form.interests || '人工智能、数据分析、小程序'
  const links = compactLinks(sourceGroups)
  const directions = pickProjectDirections(form)
  const directionLines = directions.map((item, index) => {
    const seed = item.topicSeeds.slice(0, 2).join('；')
    return `${index + 1}. ${item.name}：适合${item.suitableMajors}。可选题：${seed}。数据可来自${item.dataSources.slice(0, 3).join('、')}；成果用${item.metrics.slice(0, 3).join('、')}衡量。`
  })
  return [
    `你的选题关键词：${interests}。选题不要只写“AI+某某”，要落到“真实问题、目标用户、可采集数据、专业方法、可量化成果”。`,
    `结合专业背景：${form.major || '未填写'}；可用资源：${form.resources || '未填写'}。建议用这个公式生成题目：服务对象 + 真实痛点 + 数据来源 + 技术方法 + 可验证结果。`,
    '可优先围绕国家发展与社会需求找方向：数字中国、数字经济、就业优先、教育数字化、积极应对人口老龄化、乡村振兴、绿色低碳、文化数字化。',
    `为你生成的选题方向：\n${directionLines.join('\n')}`,
    '落地步骤：先访谈/问卷确认需求，再做数据字典和指标体系，然后做小程序或网页原型，最后用测试数据、用户反馈和对比实验证明有效。',
    links.length ? `已同步到的官方/赛事线索：${links.join('；')}` : `可先核对这些官方线索：${compactOfficialSources(4).join('；')}`,
    '建议输出物：需求调研问卷、访谈纪要、原型系统、数据字典、算法/规则说明、项目计划书、阶段测试报告、答辩PPT。'
  ].join('\n')
}

function buildCareerAdvice(form, sourceGroups) {
  const interests = form.interests || '软件开发、数据分析、人工智能'
  const links = compactLinks(sourceGroups)
  const direction = pickCareerDirection(form)
  return [
    `你的就业兴趣：${interests}。建议先锁定“${direction.roles[0]}”作为主岗位，再选“${direction.roles[1] || '相近岗位'}”作为备选。`,
    `方向背景：${direction.background}`,
    `方向优势：${direction.advantages}`,
    `适合专业：${direction.suitableMajors}。需要具备：${direction.requiredSkills.join('、')}。`,
    `如果专业能力不足，先这样补：${direction.gapPlan.join('；')}。`,
    `面试要注意：${direction.interview.join('；')}。`,
    `可做作品：${direction.projectIdeas.join('、')}。简历里要写清“你负责什么、用了什么技术、数据从哪来、结果提升多少”。`,
    links.length ? `已抓取到的就业/职业线索：${links.join('；')}` : `可先核对这些官方就业/职业线索：${compactOfficialSources(2).join('；')}；${officialPolicySources.slice(4).map((item) => `${item.title}：${item.url}`).join('；')}`,
    '下一步：用 2 周完成一个可展示项目，再用岗位 JD 反向检查技能缺口。'
  ].join('\n')
}

module.exports = { buildVolunteerAdvice, buildProjectAdvice, buildCareerAdvice }
