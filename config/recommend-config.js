/**
 * 推荐算法配置
 * 集中管理权重、阈值和评分规则
 */

// 推荐权重配置
const weights = {
  interest: 0.30,    // 兴趣匹配权重
  skill: 0.25,       // 技能匹配权重
  goal: 0.20,        // 目标匹配权重
  ability: 0.15,     // 能力匹配权重
  preference: 0.10   // 偏好匹配权重
}

// 能力维度映射
const abilityDimensions = {
  learning: '学习能力',
  tech: '技术能力',
  communication: '沟通能力',
  innovation: '创新能力',
  execution: '执行能力'
}

// 能力键映射（兼容旧版本）
const abilityKeyMap = {
  major: ['math', 'data', 'expression'],
  job: ['programming', 'practice', 'expression', 'data'],
  project: ['practice', 'team', 'data', 'expression'],
  path: ['math', 'practice', 'team']
}

// 目标类型配置
const goalTypes = {
  employment: {
    label: '就业',
    keywords: ['岗位', '开发', '工程师', '数据', '运营', '产品', '设计']
  },
  postgraduate: {
    label: '考研',
    keywords: ['学术', '研究', '深造', '研究生', '科研']
  },
  competition: {
    label: '竞赛',
    keywords: ['国创', '大创', '竞赛', '创新', '挑战杯', '互联网+']
  },
  entrepreneurship: {
    label: '创业',
    keywords: ['创业', '创新', '商业', '产品', '市场']
  },
  skillImprovement: {
    label: '提升技能',
    keywords: ['学习', '技能', '能力', '提升']
  }
}

// 兴趣方向配置
const interestCategories = {
  software: {
    label: '软件开发',
    tags: ['软件开发', 'Java', 'Python', '前端', '后端', '全栈']
  },
  data: {
    label: '数据分析',
    tags: ['数据分析', '大数据', '统计', '数据挖掘', '数据可视化']
  },
  ai: {
    label: '人工智能',
    tags: ['人工智能', '机器学习', '深度学习', 'NLP', '计算机视觉']
  },
  product: {
    label: '产品运营',
    tags: ['产品', '运营', '用户增长', '市场营销', '新媒体']
  },
  security: {
    label: '网络安全',
    tags: ['网络安全', '渗透测试', '安全运维', '信息安全']
  },
  media: {
    label: '数字媒体',
    tags: ['数字媒体', 'UI设计', '视觉设计', '交互设计', '前端开发']
  }
}

// 专业难度分级
const difficultyLevels = {
  low: {
    label: '低',
    score: 100,
    description: '入门友好，适合初学者'
  },
  medium: {
    label: '中',
    score: 85,
    description: '需要一定基础和学习时间'
  },
  mediumHigh: {
    label: '中高',
    score: 75,
    description: '需要较强基础和持续学习'
  },
  high: {
    label: '高',
    score: 65,
    description: '需要扎实基础和长期投入'
  }
}

// 推荐结果数量配置
const recommendationLimits = {
  major: 3,      // 专业推荐数量
  job: 3,        // 岗位推荐数量
  project: 3     // 项目推荐数量
}

// 匹配分数阈值
const scoreThresholds = {
  excellent: 85,    // 优秀匹配
  good: 70,         // 良好匹配
  fair: 55,         // 一般匹配
  poor: 40          // 匹配度低
}

// 评分说明
const scoreDescriptions = {
  excellent: '非常匹配，强烈推荐',
  good: '匹配度较高，建议考虑',
  fair: '有一定匹配度，可以了解',
  poor: '匹配度较低，仅供参考'
}

// 学习路径时间配置（天）
const learningPathDurations = {
  month1: 30,
  month3: 90,
  month6: 180
}

// 能力评分范围
const abilityScoreRange = {
  min: 1,
  max: 5,
  default: 3
}

// 反馈类型配置
const feedbackTypes = {
  useful: {
    label: '有用',
    value: 1
  },
  notAccurate: {
    label: '不准确',
    value: -1
  },
  neutral: {
    label: '一般',
    value: 0
  }
}

// 默认推荐配置（当用户信息不足时）
const defaultRecommendations = {
  message: '信息不足，建议完善测评以获得更精准的推荐',
  majors: ['m1', 'm2', 'm3'],  // 默认推荐的前3个专业ID
  jobs: ['j1', 'j2', 'j3'],    // 默认推荐的前3个岗位ID
  projects: ['p1', 'p2', 'p3'] // 默认推荐的前3个项目ID
}

// 默认行动建议
const defaultActions = {
  major: ['阅读目标专业培养方案', '对比课程难度、院校层次和城市资源', '把不能接受的专业限制写进志愿风险清单'],
  job: ['收集 10 条目标岗位 JD', '补齐最高频的 3 个技能', '用一个项目证明岗位能力'],
  project: ['完成用户访谈或问卷', '做出最小可演示原型', '整理数据来源、创新点和答辩材料'],
  path: ['把 30 天任务拆成每周行动', '每周沉淀一个可展示产出', '用复盘记录能力变化']
}

module.exports = {
  weights,
  abilityDimensions,
  abilityKeyMap,
  goalTypes,
  interestCategories,
  difficultyLevels,
  recommendationLimits,
  scoreThresholds,
  scoreDescriptions,
  learningPathDurations,
  abilityScoreRange,
  feedbackTypes,
  defaultRecommendations,
  defaultActions
}
