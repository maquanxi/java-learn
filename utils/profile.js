function clamp(n) { return Math.max(0, Math.min(100, Math.round(n))) }

const planLabels = {
  gaokao: {
    map: [
      ['学科优势', 'learningAbility'],
      ['志愿梯度意识', 'techAbility'],
      ['专业兴趣清晰度', 'expressionAbility'],
      ['院校资料整理度', 'projectAbility'],
      ['分数位次理解度', 'dataAbility'],
      ['升学准备度', 'careerAbility']
    ],
    fallbackStrength: '升学目标逐渐清晰，具备继续完善志愿方案的基础',
    fallbackWeakness: '当前短板不明显，建议继续核验位次、院校和专业限制',
    advice: ['核对本省一分一段和投档线', '建立冲稳保志愿梯度', '逐个查看目标专业培养方案和招生章程']
  },
  competition: {
    map: [
      ['方案论证能力', 'learningAbility'],
      ['原型/作品基础', 'techAbility'],
      ['路演表达准备', 'expressionAbility'],
      ['落地执行能力', 'projectAbility'],
      ['数据来源可获得', 'dataAbility'],
      ['项目成熟度', 'careerAbility']
    ],
    fallbackStrength: '选题方向已有基础，可以继续补证据和原型',
    fallbackWeakness: '当前短板不明显，建议继续用调研和样例数据增强可信度',
    advice: ['先完成目标用户访谈', '做出最小可演示原型', '整理申报书、路演稿和团队分工']
  },
  growth: {
    map: [
      ['课程基础', 'learningAbility'],
      ['专业工具掌握', 'techAbility'],
      ['汇报表达能力', 'expressionAbility'],
      ['项目实践积累', 'projectAbility'],
      ['资料检索能力', 'dataAbility'],
      ['成长执行力', 'careerAbility']
    ],
    fallbackStrength: '成长方向已有基础，可以继续拆成阶段任务',
    fallbackWeakness: '当前短板不明显，建议继续沉淀课程、项目和复盘材料',
    advice: ['确定本学期主攻目标', '每周推进一个可展示小任务', '用复盘记录课程、项目和升学准备变化']
  },
  career: {
    map: [
      ['学习补强能力', 'learningAbility'],
      ['岗位技能掌握', 'techAbility'],
      ['简历表达能力', 'expressionAbility'],
      ['项目经历质量', 'projectAbility'],
      ['岗位信息分析', 'dataAbility'],
      ['职业竞争力', 'careerAbility']
    ],
    fallbackStrength: '求职方向清晰，具备持续补强和投递的基础',
    fallbackWeakness: '当前短板不明显，建议继续通过项目和面试复盘拉开差距',
    advice: ['收集目标岗位JD并提炼高频技能', '补一个可展示项目或作品', '用STAR结构重写简历和面试案例']
  }
}

function generateProfile(userData = {}) {
  const a = userData.abilities || {}
  const learningAbility = clamp(((Number(a.math || 3) + Number(a.team || 3)) / 2) * 20)
  const techAbility = clamp(((Number(a.programming || 3) + Number(a.practice || 3)) / 2) * 20)
  const expressionAbility = clamp(((Number(a.expression || 3) + Number(a.team || 3)) / 2) * 20)
  const projectAbility = clamp(((Number(a.practice || 3) + Number(a.team || 3)) / 2) * 20)
  const dataAbility = clamp(((Number(a.data || 3) + Number(a.math || 3)) / 2) * 20)
  const careerAbility = clamp((techAbility * 0.3 + expressionAbility * 0.2 + projectAbility * 0.3 + dataAbility * 0.2))
  const plan = planLabels[userData.planType] || planLabels.career
  const values = { learningAbility, techAbility, expressionAbility, projectAbility, dataAbility, careerAbility }
  const map = plan.map.map((item) => [item[0], values[item[1]]])
  const strengths = map.filter((i) => i[1] >= 75).map((i) => `${i[0]}较突出`)
  const weaknesses = map.filter((i) => i[1] < 65).map((i) => `${i[0]}仍需提升`)
  return {
    learningAbility, techAbility, expressionAbility, projectAbility, dataAbility, careerAbility,
    strengths: strengths.length ? strengths : [plan.fallbackStrength],
    weaknesses: weaknesses.length ? weaknesses : [plan.fallbackWeakness],
    advice: plan.advice
  }
}
module.exports = { generateProfile }
