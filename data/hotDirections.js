const officialPolicySources = [
  {
    title: '“十四五”规划和2035年远景目标纲要',
    url: 'https://www.gov.cn/xinwen/2021-03/13/content_5592681.htm',
    signal: '数字经济、社会治理、公共服务、乡村振兴、绿色发展'
  },
  {
    title: '数字中国建设整体布局规划',
    url: 'https://www.gov.cn/zhengce/2023-02/27/content_5743484.htm',
    signal: '数字基础设施、数据资源、数字政务、数字社会'
  },
  {
    title: '“十四五”数字经济发展规划',
    url: 'https://www.gov.cn/zhengce/content/2022-01/12/content_5667817.htm',
    signal: '产业数字化、数字产业化、数据要素、平台治理'
  },
  {
    title: '全国大学生创业服务网',
    url: 'https://cy.ncss.cn/',
    signal: '创新创业训练、项目申报、竞赛展示'
  },
  {
    title: '全国大学生就业服务平台',
    url: 'https://www.ncss.cn/',
    signal: '就业指导、岗位信息、毕业生服务'
  },
  {
    title: '人力资源和社会保障部',
    url: 'https://www.mohrss.gov.cn/',
    signal: '职业能力、技能提升、就业政策、新职业信息'
  }
]

const projectDirections = [
  {
    name: 'AI+就业能力画像',
    keywords: ['人工智能', '就业', '软件', '数据', '计算机'],
    policySignal: '就业优先、数字经济、人才强国',
    suitableMajors: '软件工程、人工智能、数据科学、信息管理',
    topicSeeds: ['大学生就业能力画像与岗位匹配系统', '基于岗位JD的简历诊断与学习路径推荐', '高校毕业生就业风险预警看板'],
    dataSources: ['全国大学生就业服务平台岗位信息', '学校就业质量报告', '问卷与访谈数据', '公开招聘JD'],
    outputs: ['画像指标体系', '岗位匹配规则/模型', '小程序原型', '就业建议报告'],
    metrics: ['匹配准确率', '简历修改前后评分差', '用户完成率', '岗位覆盖数']
  },
  {
    name: '教育数字化与学习路径',
    keywords: ['教育', '学习', '软件', '人工智能', '数字媒体'],
    policySignal: '教育数字化、数字中国、公共服务均等化',
    suitableMajors: '教育技术学、软件工程、数字媒体技术、计算机类',
    topicSeeds: ['基于知识图谱的课程学习路径规划', '校园学习资源个性化推荐平台', 'AI助教答疑与错题归因小程序'],
    dataSources: ['课程大纲', '学习记录', '题库标签', '问卷反馈'],
    outputs: ['知识点图谱', '学习路径推荐', '错题分析', '阶段测评报告'],
    metrics: ['学习完成率', '推荐采纳率', '错题复现下降率', '满意度']
  },
  {
    name: '智慧养老与社区服务',
    keywords: ['养老', '老龄化', '社区', '健康', '医学', '服务'],
    policySignal: '积极应对人口老龄化、基层公共服务',
    suitableMajors: '医学信息工程、护理、社会工作、软件工程、信息管理',
    topicSeeds: ['社区老人用药提醒与健康档案小程序', '独居老人需求采集与志愿服务匹配平台', '适老化数字服务体验优化研究'],
    dataSources: ['社区调研问卷', '志愿服务记录', '公开养老政策', '访谈纪要'],
    outputs: ['需求画像', '服务匹配流程', '适老化界面原型', '隐私保护方案'],
    metrics: ['服务响应时间', '需求匹配率', '老人可用性评分', '志愿者参与率']
  },
  {
    name: '乡村振兴与智慧农业',
    keywords: ['农业', '乡村', '电商', '物联网', '环保'],
    policySignal: '乡村振兴、农业现代化、县域数字经济',
    suitableMajors: '物联网工程、电子商务、数据科学、农学相关、软件工程',
    topicSeeds: ['农产品供需匹配与溯源小程序', '智慧种植数据看板', '乡村文旅资源数字化推荐平台'],
    dataSources: ['农产品价格公开信息', '传感器模拟数据', '电商评价', '村镇调研'],
    outputs: ['数据看板', '溯源流程', '供需匹配规则', '运营方案'],
    metrics: ['信息更新频率', '订单转化率', '库存周转', '农户满意度']
  },
  {
    name: '绿色低碳校园',
    keywords: ['环保', '低碳', '能源', '校园', '物联网'],
    policySignal: '绿色发展、双碳目标、节约型校园',
    suitableMajors: '物联网工程、环境类、数据科学、软件工程',
    topicSeeds: ['校园垃圾分类识别与积分激励系统', '宿舍用能数据分析与节能建议平台', '低碳行为打卡与碳减排估算小程序'],
    dataSources: ['校园问卷', '能耗模拟数据', '垃圾分类公开规则', '打卡行为数据'],
    outputs: ['分类规则库', '节能建议模型', '低碳积分机制', '可视化报告'],
    metrics: ['分类正确率', '节能估算量', '参与人数', '连续打卡率']
  },
  {
    name: '数字文化与无障碍服务',
    keywords: ['数字媒体', '文化', '设计', '前端', '无障碍'],
    policySignal: '文化数字化、数字社会、适老化与无障碍服务',
    suitableMajors: '数字媒体技术、视觉传达、软件工程、教育技术学',
    topicSeeds: ['非遗数字展陈与互动传播小程序', '校园导览无障碍信息服务平台', '地方文化短视频数据分析与传播方案'],
    dataSources: ['公开文化资源', '用户访谈', '无障碍规范', '传播数据'],
    outputs: ['交互原型', '内容数据库', '可访问性测试报告', '传播复盘'],
    metrics: ['浏览完成率', '互动次数', '无障碍问题数', '传播转化率']
  }
]

const careerDirections = {
  高考志愿规划: {
    name: '高考志愿规划',
    mode: 'volunteer',
    backgroundLabel: '适用场景',
    advantagesLabel: '规划重点',
    suitableLabel: '适合人群',
    rolesLabel: '核心动作',
    background: '面向高三与高考后学生，围绕分数、位次、科类、批次、院校层次、城市偏好和专业兴趣做志愿准备。',
    advantages: '只讨论高考升学，不混入薪资、求职和大学竞赛；先核验省考试院与阳光高考信息，再形成冲稳保梯度。',
    suitableMajors: '高三考生、高考出分后学生、需要专业认知和志愿梯度判断的家庭',
    roles: ['位次换算', '冲稳保梯度', '专业认知', '招生章程核验'],
    requiredSkills: ['省份科类', '分数位次', '专业兴趣', '城市偏好', '批次规则', '风险意识'],
    gapPlan: ['先确认本省一分一段和投档线', '列出专业兴趣清单', '按冲稳保整理候选院校'],
    interview: ['核对招生章程限制', '比较专业课程和就业/深造出口', '避免只看学校名气忽略专业适配'],
    projectIdeas: ['志愿梯度表', '专业认知卡片', '院校城市对比清单']
  },
  专业认知探索: {
    name: '专业认知探索',
    mode: 'volunteer',
    backgroundLabel: '适用场景',
    advantagesLabel: '探索重点',
    suitableLabel: '适合人群',
    rolesLabel: '认知维度',
    background: '帮助高考生把“喜欢某个词”转化为对课程、能力要求、深造方向和职业出口的具体判断。',
    advantages: '适合在志愿填报前做专业排雷，避免把大学专业、岗位名称和热门概念混为一谈。',
    suitableMajors: '正在比较计算机、数据、师范、医学、商科、数字媒体等方向的高中生',
    roles: ['课程难度', '能力要求', '深造出口', '转专业风险'],
    requiredSkills: ['兴趣表达', '学科优势', '资料检索', '家庭沟通'],
    gapPlan: ['读目标专业培养方案', '访谈1-2位在读学生', '把“喜欢/不喜欢”的理由写清楚'],
    interview: ['关注必修课而非只看专业名称', '比较同名专业在不同院校的差异', '记录不能接受的课程或培养方式'],
    projectIdeas: ['专业认知清单', '专业对比矩阵', '大学四年路线草图']
  },
  院校城市选择: {
    name: '院校城市选择',
    mode: 'volunteer',
    backgroundLabel: '适用场景',
    advantagesLabel: '判断重点',
    suitableLabel: '适合人群',
    rolesLabel: '比较维度',
    background: '用于高考志愿阶段比较学校层次、城市资源、通勤距离、家庭预算和未来深造机会。',
    advantages: '把“学校优先、专业优先、城市优先”的取舍显性化，减少临时拍脑袋填报。',
    suitableMajors: '需要在院校层次、专业兴趣和城市之间做权衡的高考生',
    roles: ['城市资源', '学校层次', '专业实力', '家庭预算'],
    requiredSkills: ['位次区间', '城市偏好', '家庭沟通', '风险偏好'],
    gapPlan: ['确定底线城市和可接受距离', '整理目标院校近年位次', '标注不可接受专业或限制条件'],
    interview: ['注意校区位置', '核对中外合作/大类招生/转专业规则', '保留保底志愿'],
    projectIdeas: ['院校城市对比表', '家庭沟通纪要', '志愿风险清单']
  },
  人工智能: {
    name: '人工智能',
    background: '从模型研发转向“模型+场景+产品”的应用落地，适合把算法、数据和业务问题结合起来做作品。',
    advantages: '项目展示空间大，能和教育、就业、医疗、农业、政务服务等场景结合，竞赛和就业都容易形成差异化。',
    suitableMajors: '人工智能、计算机科学与技术、软件工程、数据科学、医学信息工程',
    roles: ['AI应用开发', '算法工程师助理', '数据标注/评测', '智能产品助理'],
    requiredSkills: ['Python基础', '机器学习基本概念', '模型API调用', '数据清洗', '提示词与评测', '隐私与伦理意识'],
    gapPlan: ['先完成一个模型调用小程序', '补一份数据集清洗报告', '用准确率/召回率/用户反馈证明效果'],
    interview: ['能讲清模型解决了什么真实问题', '准备一个可运行Demo', '说明数据来源、边界和失败案例', '避免夸大模型效果'],
    projectIdeas: ['AI志愿助手', '就业能力画像', '学习路径推荐', '简历诊断助手']
  },
  软件开发: {
    name: '软件开发',
    background: '软件开发重视工程实现和持续迭代，核心是把需求变成稳定可用的系统。',
    advantages: '就业面广，项目作品最容易验证能力，也能服务国创、竞赛、小程序和校园系统。',
    suitableMajors: '软件工程、计算机科学与技术、网络工程、信息管理与信息系统',
    roles: ['Java后端开发', '前端开发', '小程序开发', '软件测试'],
    requiredSkills: ['编程语言', '数据库', '接口设计', 'Git', '测试用例', '部署上线'],
    gapPlan: ['补一个完整CRUD项目', '写接口文档和测试报告', '把项目部署成可演示版本'],
    interview: ['准备项目架构图', '讲清数据库表设计', '说明遇到的Bug和优化', '熟悉常见基础题'],
    projectIdeas: ['校园服务小程序', '投档线查询系统', '竞赛申报管理平台', '就业岗位推荐系统']
  },
  数据分析: {
    name: '数据分析',
    background: '数据分析连接业务问题和决策建议，适合用公开数据、问卷和平台记录做洞察。',
    advantages: '不一定从高深算法起步，能用SQL、Excel/Python和可视化快速形成报告和看板。',
    suitableMajors: '数据科学、统计、财务管理、电子商务、信息管理',
    roles: ['数据分析师', '经营分析', '用户运营分析', '数据产品助理'],
    requiredSkills: ['Excel/SQL', 'Python/Pandas', '统计思维', '可视化', '指标体系', '业务表达'],
    gapPlan: ['整理一个公开数据分析报告', '做一张指标看板', '练习从问题到结论的汇报'],
    interview: ['带作品集讲分析链路', '说明指标口径', '准备SQL题', '避免只展示图表不解释决策价值'],
    projectIdeas: ['高考志愿数据看板', '就业岗位需求分析', '校园消费分析', '竞赛选题趋势分析']
  },
  数字媒体: {
    name: '数字媒体',
    background: '数字媒体把内容、交互和技术结合起来，越来越重视可访问性、传播数据和用户体验。',
    advantages: '适合做作品集，能与非遗传播、校园导览、教育内容和新媒体运营结合。',
    suitableMajors: '数字媒体技术、视觉传达、教育技术学、软件工程',
    roles: ['UI/UX设计', '前端交互', '新媒体运营', '内容产品助理'],
    requiredSkills: ['视觉设计', '交互原型', '基础前端', '内容策划', '数据复盘', '作品集表达'],
    gapPlan: ['完成3个界面改版案例', '补一份用户测试记录', '把传播数据写进作品集'],
    interview: ['展示设计过程而不只展示成品', '说明用户是谁', '准备交互细节和取舍理由', '能讲数据复盘'],
    projectIdeas: ['非遗数字展陈', '校园导览小程序', '无障碍信息服务', '课程内容可视化']
  },
  教育科技: {
    name: '教育科技',
    background: '教育科技关注学习效果、内容组织和数字化工具，适合把专业知识转化为可验证的学习产品。',
    advantages: '校园调研方便，能结合课程、题库、学习行为和AI助教做出闭环。',
    suitableMajors: '教育技术学、软件工程、人工智能、数字媒体技术',
    roles: ['教育产品运营', '课程产品助理', '学习数据分析', 'AI助教产品助理'],
    requiredSkills: ['课程设计', '学习评价', '用户调研', '原型设计', '数据分析', '内容运营'],
    gapPlan: ['做一次学习需求调研', '设计一个小型课程原型', '用前后测证明效果'],
    interview: ['讲清学习目标和评价方法', '说明用户调研样本', '准备课程/产品原型', '关注未成年人和隐私合规'],
    projectIdeas: ['学习路径规划', '错题归因系统', '校园资源推荐', 'AI助教答疑']
  },
  创新创业: {
    name: '创新创业',
    background: '创新创业不是只写商业计划书，而是围绕真实需求完成调研、原型、验证和迭代。',
    advantages: '适合跨专业组队，把技术、运营、设计和行业资源整合成可展示成果。',
    suitableMajors: '电子商务、信息管理、软件工程、数字媒体、财务管理',
    roles: ['创业项目负责人', '产品运营', '商业分析', '项目申报负责人'],
    requiredSkills: ['需求调研', '商业模式', '原型设计', '数据验证', '路演表达', '财务测算'],
    gapPlan: ['先访谈20个目标用户', '做MVP验证核心功能', '用数据证明需求真实存在'],
    interview: ['路演先讲痛点和证据', '准备竞品和成本测算', '说明团队分工', '不要只讲愿景不讲验证'],
    projectIdeas: ['校园服务平台', '县域电商方案', '就业服务工具', '低碳行为激励平台']
  },
  国创竞赛选题: {
    name: '国创竞赛选题',
    mode: 'project',
    backgroundLabel: '适用场景',
    advantagesLabel: '选题重点',
    suitableLabel: '适合项目',
    rolesLabel: '准备材料',
    background: '面向大学生创新创业训练计划、挑战杯、互联网+等比赛，核心是把真实需求、专业能力和可演示成果连起来。',
    advantages: '只围绕竞赛选题、项目论证、原型、数据来源和答辩材料，不混入薪资和求职偏好。',
    suitableMajors: '软件、数据、教育、医学、农业、数字媒体、电商、管理等跨专业团队',
    roles: ['需求调研', '项目创新点', '原型作品', '答辩材料'],
    requiredSkills: ['问卷访谈', '选题论证', '原型设计', '数据整理', '团队分工', '路演表达'],
    gapPlan: ['先访谈目标用户', '确定一个能做出的MVP', '用数据或样例证明需求存在'],
    interview: ['痛点要有证据', '技术路线要可落地', '团队分工要具体', '成果形式要能展示'],
    projectIdeas: ['校园服务小程序', 'AI助教工具', '乡村电商溯源', '低碳校园积分系统']
  },
  创业计划书打磨: {
    name: '创业计划书打磨',
    mode: 'project',
    backgroundLabel: '适用场景',
    advantagesLabel: '打磨重点',
    suitableLabel: '适合项目',
    rolesLabel: '核心模块',
    background: '适合已经有初步想法的大学生团队，把创意整理成商业计划书、路演稿和验证数据。',
    advantages: '聚焦痛点、用户、竞品、商业模式、成本测算和阶段成果，不把比赛测评变成求职测评。',
    suitableMajors: '创新创业团队、互联网+项目、挑战杯创业计划类项目',
    roles: ['用户痛点', '竞品分析', '商业模式', '路演表达'],
    requiredSkills: ['商业画布', '财务测算', '用户访谈', '竞品分析', 'PPT表达'],
    gapPlan: ['补充目标用户访谈', '验证首个付费/使用场景', '拆分近期里程碑'],
    interview: ['不要只讲愿景', '用数据证明需求', '说明收入和成本假设', '明确团队执行能力'],
    projectIdeas: ['校园轻服务平台', '本地生活工具', '县域电商项目', '教育内容产品']
  },
  考研升学规划: {
    name: '考研升学规划',
    mode: 'project',
    backgroundLabel: '适用场景',
    advantagesLabel: '规划重点',
    suitableLabel: '适合人群',
    rolesLabel: '准备维度',
    background: '面向大学生的升学规划，关注目标院校、专业课基础、科研/竞赛经历和复习节奏。',
    advantages: '帮助大学生把课程、竞赛、科研和复习时间排清楚，不与高中志愿或求职薪资问题混在一起。',
    suitableMajors: '大一到大三正在考虑考研、保研或继续深造的学生',
    roles: ['目标院校', '专业课基础', '科研经历', '复习节奏'],
    requiredSkills: ['信息检索', '学习计划', '专业课基础', '论文/项目经历'],
    gapPlan: ['确定目标层级', '整理考试科目', '把课程绩点和项目经历补齐'],
    interview: ['不要过早只盯一个学校', '核对招生目录', '保留备选方向', '把每周复习时间落到日历'],
    projectIdeas: ['考研信息表', '复习进度看板', '专业课资料库']
  },
  简历面试准备: {
    name: '简历面试准备',
    mode: 'career',
    background: '面向求职者和毕业生，把经历翻译成岗位能看懂的项目、职责、结果和证据。',
    advantages: '适合从“我做过什么”整理到“我能胜任什么”，重点是简历、作品集和面试表达。',
    suitableMajors: '计算机、数据、产品、运营、设计、教育服务等方向',
    roles: ['简历优化', '面试准备', '作品集整理', '岗位匹配'],
    requiredSkills: ['STAR表达', '项目复盘', '岗位JD分析', '面试问答', '作品链接'],
    gapPlan: ['重写项目经历', '准备3个高频面试问题', '补一个可展示作品'],
    interview: ['讲清个人职责', '量化项目结果', '准备失败案例复盘', '避免空泛描述'],
    projectIdeas: ['简历诊断表', '面试题库', '作品集主页']
  },
  岗位技能缺口: {
    name: '岗位技能缺口',
    mode: 'career',
    background: '面向求职者，用目标岗位JD反推技能、项目、证书和作品短板。',
    advantages: '能把求职目标拆成可学习任务，适合校招、转行和实习准备。',
    suitableMajors: '软件、数据、产品、运营、设计、教育、管理等求职方向',
    roles: ['技能清单', '项目补强', '学习路径', '投递策略'],
    requiredSkills: ['岗位检索', '技能拆解', '项目实践', '简历表达'],
    gapPlan: ['收集10个目标JD', '标出重复技能', '用4周补一个作品证明'],
    interview: ['不要只写会用工具', '要给出作品链接和结果', '区分核心技能和加分技能'],
    projectIdeas: ['岗位JD分析看板', '技能差距表', '四周补强计划']
  }
}

function getHotDirection(name) {
  return careerDirections[name] || careerDirections.人工智能
}

function directionNames() {
  return Object.keys(careerDirections)
}

function scoreByText(item, text) {
  return item.keywords.reduce((score, key) => score + (text.indexOf(key) >= 0 ? 1 : 0), 0)
}

function pickProjectDirections(form = {}) {
  const text = `${form.major || ''}${form.interests || ''}${form.resources || ''}`
  const ranked = projectDirections
    .map((item) => ({ ...item, score: scoreByText(item, text) }))
    .sort((a, b) => b.score - a.score)
  return ranked.slice(0, ranked[0] && ranked[0].score > 0 ? 4 : 5)
}

function pickCareerDirection(form = {}) {
  const text = `${form.skills || ''}${form.interests || ''}${form.preference || ''}`
  const exact = directionNames().find((name) => text.indexOf(name) >= 0)
  if (exact) return getHotDirection(exact)
  if (/Java|前端|后端|测试|小程序|软件|开发/.test(text)) return getHotDirection('软件开发')
  if (/Python|SQL|数据|统计|分析|可视化/.test(text)) return getHotDirection('数据分析')
  if (/AI|人工智能|算法|模型|机器学习/.test(text)) return getHotDirection('人工智能')
  if (/媒体|设计|视觉|交互|运营|内容/.test(text)) return getHotDirection('数字媒体')
  if (/教育|课程|学习|老师|教培/.test(text)) return getHotDirection('教育科技')
  if (/创业|商业|电商|项目|路演/.test(text)) return getHotDirection('创新创业')
  return getHotDirection('软件开发')
}

module.exports = {
  officialPolicySources,
  projectDirections,
  careerDirections,
  directionNames,
  getHotDirection,
  pickProjectDirections,
  pickCareerDirection
}
