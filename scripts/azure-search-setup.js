/**
 * Azure AI Search 初始化脚本
 *
 * 功能：创建教育数据索引 + 灌入初始数据
 * 运行：node scripts/azure-search-setup.js
 *
 * 环境变量（也可直接修改下方配置）：
 *   AZURE_SEARCH_ENDPOINT  — e.g. https://your-service.search.windows.net
 *   AZURE_SEARCH_KEY       — 管理密钥（admin key）
 *   AZURE_SEARCH_INDEX     — 索引名（默认 education-data）
 */

const https = require('https')

const ENDPOINT = process.env.AZURE_SEARCH_ENDPOINT || 'https://YOUR_SERVICE.search.windows.net'
const KEY = process.env.AZURE_SEARCH_KEY || 'YOUR_ADMIN_KEY'
const INDEX = process.env.AZURE_SEARCH_INDEX || 'education-data'

// ── 请求工具 ──
function request(method, path, body) {
  const parsed = new URL(ENDPOINT)
  const data = body ? JSON.stringify(body) : null
  return new Promise((resolve, reject) => {
    const req = https.request({
      hostname: parsed.hostname,
      path,
      method,
      headers: {
        'Content-Type': 'application/json',
        'api-key': KEY
      }
    }, (res) => {
      const chunks = []
      res.on('data', c => chunks.push(c))
      res.on('end', () => {
        const text = Buffer.concat(chunks).toString('utf8')
        const status = res.statusCode
        if (status >= 200 && status < 300) {
          try { resolve(JSON.parse(text)) } catch { resolve(text) }
        } else {
          console.error(`[${status}] ${path}\n${text.slice(0, 500)}`)
          reject(new Error(`HTTP ${status}`))
        }
      })
    })
    req.on('error', reject)
    if (data) req.write(data)
    req.end()
  })
}

// ── 第一步：创建索引 ──
async function createIndex() {
  console.log(`创建索引: ${INDEX} ...`)
  try {
    await request('PUT', `/indexes/${INDEX}?api-version=2024-07-01`, {
      name: INDEX,
      fields: [
        { name: 'id',            type: 'Edm.String',    key: true,  filterable: true },
        { name: 'title',         type: 'Edm.String',    searchable: true,  analyzer: 'ja.microsoft' },
        { name: 'content',       type: 'Edm.String',    searchable: true,  analyzer: 'ja.microsoft' },
        { name: 'category',      type: 'Edm.String',    filterable: true,  facetable: true },
        { name: 'province',      type: 'Edm.String',    filterable: true,  facetable: true },
        { name: 'year',          type: 'Edm.String',    filterable: true,  facetable: true },
        { name: 'score_min',     type: 'Edm.Double',    filterable: true,  sortable: true },
        { name: 'rank_max',      type: 'Edm.Double',    filterable: true,  sortable: true },
        { name: 'university',    type: 'Edm.String',    filterable: true,  searchable: true },
        { name: 'major',         type: 'Edm.String',    filterable: true,  searchable: true },
        { name: 'tier',          type: 'Edm.String',    filterable: true,  facetable: true },
        { name: 'source_url',    type: 'Edm.String' }
      ],
      semanticSearch: {
        defaultConfiguration: 'default',
        configurations: [{
          name: 'default',
          prioritizedFields: {
            titleField: { fieldName: 'title' },
            contentFields: [{ fieldName: 'content' }],
            keywordFields: [{ fieldName: 'category' }, { fieldName: 'province' }]
          }
        }]
      }
    })
    console.log('索引创建成功')
  } catch (e) {
    if (e.message.includes('409')) {
      console.log('索引已存在，跳过创建')
    } else {
      throw e
    }
  }
}

// ── 第二步：灌入数据 ──
// 每批最多 1000 条
async function uploadDocuments(docs) {
  const batchSize = 500
  for (let i = 0; i < docs.length; i += batchSize) {
    const batch = docs.slice(i, i + batchSize)
    console.log(`上传 ${i + 1}-${i + batch.length} / ${docs.length} ...`)
    await request('POST', `/indexes/${INDEX}/docs/index?api-version=2024-07-01`, {
      value: batch.map(doc => ({ '@search.action': 'upload', ...doc }))
    })
  }
  console.log('全部上传完成')
}

// ── 教育数据（可自行扩充） ──
function buildEducationData() {
  const docs = []
  let id = 0

  // --- 大学数据 ---
  const universities = [
    { name: '北京大学', tier: '985', province: '北京', type: '综合' },
    { name: '清华大学', tier: '985', province: '北京', type: '理工' },
    { name: '复旦大学', tier: '985', province: '上海', type: '综合' },
    { name: '上海交通大学', tier: '985', province: '上海', type: '综合' },
    { name: '浙江大学', tier: '985', province: '浙江', type: '综合' },
    { name: '南京大学', tier: '985', province: '江苏', type: '综合' },
    { name: '中国科学技术大学', tier: '985', province: '安徽', type: '理工' },
    { name: '武汉大学', tier: '985', province: '湖北', type: '综合' },
    { name: '华中科技大学', tier: '985', province: '湖北', type: '理工' },
    { name: '中山大学', tier: '985', province: '广东', type: '综合' },
    { name: '西安交通大学', tier: '985', province: '陕西', type: '综合' },
    { name: '哈尔滨工业大学', tier: '985', province: '黑龙江', type: '理工' },
    { name: '同济大学', tier: '985', province: '上海', type: '理工' },
    { name: '北京师范大学', tier: '985', province: '北京', type: '师范' },
    { name: '南开大学', tier: '985', province: '天津', type: '综合' },
    { name: '天津大学', tier: '985', province: '天津', type: '理工' },
    { name: '厦门大学', tier: '985', province: '福建', type: '综合' },
    { name: '东南大学', tier: '985', province: '江苏', type: '理工' },
    { name: '北京航空航天大学', tier: '985', province: '北京', type: '理工' },
    { name: '北京理工大学', tier: '985', province: '北京', type: '理工' },
    { name: '中国人民大学', tier: '985', province: '北京', type: '综合' },
    { name: '中国农业大学', tier: '985', province: '北京', type: '农林' },
    { name: '山东大学', tier: '985', province: '山东', type: '综合' },
    { name: '四川大学', tier: '985', province: '四川', type: '综合' },
    { name: '吉林大学', tier: '985', province: '吉林', type: '综合' },
    { name: '中南大学', tier: '985', province: '湖南', type: '综合' },
    { name: '湖南大学', tier: '985', province: '湖南', type: '综合' },
    { name: '重庆大学', tier: '985', province: '重庆', type: '综合' },
    { name: '电子科技大学', tier: '985', province: '四川', type: '理工' },
    { name: '西北工业大学', tier: '985', province: '陕西', type: '理工' },
    { name: '大连理工大学', tier: '985', province: '辽宁', type: '理工' },
    { name: '华南理工大学', tier: '985', province: '广东', type: '理工' },
    { name: '兰州大学', tier: '985', province: '甘肃', type: '综合' },
    { name: '东北大学', tier: '985', province: '辽宁', type: '理工' },
    { name: '中国海洋大学', tier: '985', province: '山东', type: '综合' },
    // 211 部分（可继续扩充）
    { name: '北京邮电大学', tier: '211', province: '北京', type: '理工' },
    { name: '中央财经大学', tier: '211', province: '北京', type: '财经' },
    { name: '上海财经大学', tier: '211', province: '上海', type: '财经' },
    { name: '对外经济贸易大学', tier: '211', province: '北京', type: '财经' },
    { name: '南京航空航天大学', tier: '211', province: '江苏', type: '理工' },
    { name: '南京理工大学', tier: '211', province: '江苏', type: '理工' },
    { name: '河海大学', tier: '211', province: '江苏', type: '理工' },
    { name: '西南交通大学', tier: '211', province: '四川', type: '理工' },
    { name: '西南财经大学', tier: '211', province: '四川', type: '财经' },
    { name: '武汉理工大学', tier: '211', province: '湖北', type: '理工' },
    { name: '郑州大学', tier: '211', province: '河南', type: '综合' },
    { name: '暨南大学', tier: '211', province: '广东', type: '综合' },
    { name: '苏州大学', tier: '211', province: '江苏', type: '综合' },
    { name: '合肥工业大学', tier: '211', province: '安徽', type: '理工' },
    { name: '华南师范大学', tier: '211', province: '广东', type: '师范' },
    { name: '华中师范大学', tier: '211', province: '湖北', type: '师范' },
    { name: '南京师范大学', tier: '211', province: '江苏', type: '师范' },
    { name: '东北师范大学', tier: '211', province: '吉林', type: '师范' },
    { name: '西南大学', tier: '211', province: '重庆', type: '综合' },
    { name: '长安大学', tier: '211', province: '陕西', type: '理工' }
  ]

  universities.forEach(u => {
    docs.push({
      id: `uni-${++id}`,
      title: u.name,
      content: `${u.name}是${u.tier === '985' ? '985工程/211工程/双一流' : '211工程/双一流'}高校，位于${u.province}，${u.type}类院校。`,
      category: '大学',
      province: u.province,
      year: '',
      score_min: null,
      rank_max: null,
      university: u.name,
      major: '',
      tier: u.tier,
      source_url: 'https://gaokao.chsi.com.cn/'
    })
  })

  // --- 专业数据 ---
  const majors = [
    { name: '计算机科学与技术', cat: '工学', desc: '核心课程：数据结构、操作系统、计算机网络、数据库、编译原理、人工智能。就业方向：软件开发、算法工程师、数据工程师、系统架构师。考研方向：计算机科学与技术、软件工程、人工智能。' },
    { name: '软件工程', cat: '工学', desc: '核心课程：软件需求分析、软件设计、软件测试、项目管理、Web开发。就业方向：后端/前端/全栈开发、测试工程师、DevOps。' },
    { name: '人工智能', cat: '工学', desc: '核心课程：机器学习、深度学习、自然语言处理、计算机视觉、强化学习。就业方向：AI算法工程师、大模型应用开发、数据科学家。新兴方向：AIGC、多模态、具身智能。' },
    { name: '数据科学与大数据技术', cat: '工学', desc: '核心课程：统计学、机器学习、大数据处理(Hadoop/Spark)、数据可视化。就业方向：数据分析师、数据工程师、BI工程师。' },
    { name: '电子信息工程', cat: '工学', desc: '核心课程：信号与系统、通信原理、数字电路、嵌入式系统。就业方向：嵌入式开发、通信工程师、芯片设计、FPGA工程师。' },
    { name: '电气工程及其自动化', cat: '工学', desc: '核心课程：电路分析、电机学、电力系统分析、自动控制原理。就业方向：电网公司、电力设计院、新能源企业、自动化工程师。' },
    { name: '临床医学', cat: '医学', desc: '学制5+3年，核心课程：人体解剖学、生理学、病理学、内科学、外科学。就业方向：医院临床医生、医学研究。需参加规培3年。' },
    { name: '口腔医学', cat: '医学', desc: '学制5年，核心课程：口腔解剖学、口腔内科学、口腔颌面外科学。就业方向：口腔医院、综合医院口腔科、私人诊所。' },
    { name: '法学', cat: '法学', desc: '核心课程：法理学、宪法学、民法学、刑法学、诉讼法。就业方向：律师、法务、公务员(法院/检察院)、公证员。需通过法考。' },
    { name: '金融学', cat: '经济学', desc: '核心课程：货币银行学、国际金融、证券投资学、公司金融。就业方向：银行、证券、基金、保险、金融科技。' },
    { name: '会计学', cat: '管理学', desc: '核心课程：基础会计、中级财务会计、成本会计、审计学、税法。就业方向：会计师事务所、企业财务、银行、公务员(税务)。可考CPA。' },
    { name: '汉语言文学', cat: '文学', desc: '核心课程：古代文学、现当代文学、语言学概论、文学理论。就业方向：语文教师、编辑、公务员、文案策划、新媒体运营。' },
    { name: '英语', cat: '文学', desc: '核心课程：综合英语、翻译理论与实践、英美文学、语言学。就业方向：翻译、外贸、英语教师、国际商务。可考CATTI、专八。' },
    { name: '数学与应用数学', cat: '理学', desc: '核心课程：数学分析、高等代数、概率论、常微分方程。就业方向：数据分析、金融量化、算法研发、教师。考研可转计算机/金融/统计。' },
    { name: '新能源科学与工程', cat: '工学', desc: '核心课程：太阳能/风能/储能技术、电力电子技术。就业方向：新能源车企(比亚迪/蔚来)、光伏企业(隆基)、储能公司、国家电网新能源部门。' },
    { name: '网络安全', cat: '工学', desc: '核心课程：密码学、网络攻防、渗透测试、安全运维。就业方向：安全工程师、渗透测试、等保测评、安全运营(SOC)。行业需求大。' },
    { name: '机器人工程', cat: '工学', desc: '核心课程：机器人学、运动控制、传感器技术、SLAM。就业方向：工业机器人、服务机器人、自动驾驶、无人机。' },
    { name: '护理学', cat: '医学', desc: '核心课程：基础护理学、内外科护理、妇儿科护理。就业方向：三甲医院护士、社区医疗、健康管理。本科护士就业竞争力强。' }
  ]

  majors.forEach(m => {
    docs.push({
      id: `major-${++id}`,
      title: m.name,
      content: `${m.name}（${m.cat}类）：${m.desc}`,
      category: '专业',
      province: '',
      year: '',
      score_min: null,
      rank_max: null,
      university: '',
      major: m.name,
      tier: '',
      source_url: 'https://gaokao.chsi.com.cn/zxjk/'
    })
  })

  // --- 竞赛数据 ---
  const competitions = [
    { name: '中国国际大学生创新大赛（互联网+）', level: 'A类', desc: '教育部主办，含高教主赛道、红旅赛道、产业赛道。金奖可获保研加分，优秀项目可获投资。备赛建议：选题结合国家战略需求，准备商业计划书和路演PPT。' },
    { name: '挑战杯', level: 'A类', desc: '分为"大挑"(课外学术科技作品竞赛)和"小挑"(创业计划竞赛)，隔年交替举办。要求有实物作品或深度调研报告。' },
    { name: '全国大学生数学建模竞赛', level: 'A类', desc: '每年9月举办，3人组队72小时完成建模论文。国一获奖率约0.5%，是含金量最高的理工科竞赛之一。' },
    { name: 'ACM-ICPC国际大学生程序设计竞赛', level: 'A类', desc: '3人组队5小时解决算法题。区域赛金奖可获保研资格。建议从大一开始刷题(LeetCode/Codeforces)。' },
    { name: '全国大学生电子设计竞赛', level: 'A类', desc: '4天3夜完成电子系统设计制作。题目涵盖模拟电路、数字电路、嵌入式、信号处理。' },
    { name: '全国大学生创新创业训练计划（国创/SRT）', level: '国家级', desc: '每项经费1-2万元，周期1-2年。分创新训练、创业训练、创业实践三类。结题需论文/专利/竞赛奖/原型。' }
  ]

  competitions.forEach(c => {
    docs.push({
      id: `comp-${++id}`,
      title: c.name,
      content: `${c.name}（${c.level}）：${c.desc}`,
      category: '竞赛',
      province: '',
      year: '',
      score_min: null,
      rank_max: null,
      university: '',
      major: '',
      tier: c.level,
      source_url: 'https://cy.ncss.cn/'
    })
  })

  // --- 志愿填报方法 ---
  docs.push({
    id: `method-${++id}`,
    title: '志愿填报位次法指南',
    content: '位次法核心步骤：1.根据分数查本省一分一段表得位次。2.用位次对照目标学校近3年录取最低位次。3.冲=位次高10-20%的学校；稳=位次相近±5%；保=位次低15-25%。4.每所学校填6个专业，按喜好排序并勾选服从调剂。数据来源：各省教育考试院官网和阳光高考平台(gaokao.chsi.com.cn)。',
    category: '方法论',
    province: '',
    year: '',
    score_min: null,
    rank_max: null,
    university: '',
    major: '',
    tier: '',
    source_url: 'https://gaokao.chsi.com.cn/'
  })

  // --- 就业数据 ---
  docs.push({
    id: `career-${++id}`,
    title: '2024-2025热门就业赛道',
    content: '高需求赛道：人工智能(算法/应用)、新能源汽车(比亚迪/蔚来/小鹏)、半导体芯片(中芯/华为海思)、网络安全(等保/渗透)、生物医药(CRO/CDMO)。考公热门系统：税务、海关、统计局、银保监。新兴岗位：AIGC工程师、数据标注、大模型微调、储能工程师。一线城市起薪参考：算法岗25-40K、开发岗15-25K、产品岗15-20K、测试岗12-18K。',
    category: '就业',
    province: '',
    year: '2025',
    score_min: null,
    rank_max: null,
    university: '',
    major: '',
    tier: '',
    source_url: 'https://www.ncss.cn/'
  })

  return docs
}

// ── 主流程 ──
async function main() {
  console.log('=== Azure AI Search 教育数据初始化 ===')
  console.log(`Endpoint: ${ENDPOINT}`)
  console.log(`Index: ${INDEX}`)
  console.log()

  if (ENDPOINT.includes('YOUR_SERVICE') || KEY === 'YOUR_ADMIN_KEY') {
    console.error('请先设置环境变量：')
    console.error('  AZURE_SEARCH_ENDPOINT=https://your-service.search.windows.net')
    console.error('  AZURE_SEARCH_KEY=your-admin-key')
    process.exit(1)
  }

  await createIndex()

  const docs = buildEducationData()
  console.log(`共 ${docs.length} 条数据待上传`)
  await uploadDocuments(docs)

  console.log()
  console.log('=== 完成 ===')
  console.log('可在 Azure Portal 的 Search Explorer 中测试查询')
}

main().catch(err => {
  console.error('失败:', err.message)
  process.exit(1)
})
