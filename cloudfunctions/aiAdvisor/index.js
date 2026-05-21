const https = require('https')
const {
  runLightMcpTools,
  buildToolContext,
  buildLocalToolAnswer,
  queryGaokaoRank
} = require('./lightMcpTools')

// ── DeepSeek 配置 ──
const providerMap = {
  deepseek: { baseUrl: 'https://api.deepseek.com/chat/completions', model: 'deepseek-chat' },
  qwen: { baseUrl: 'https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions', model: 'qwen-plus' },
  zhipu: { baseUrl: 'https://open.bigmodel.cn/api/paas/v4/chat/completions', model: 'glm-4-flash' },
  moonshot: { baseUrl: 'https://api.moonshot.cn/v1/chat/completions', model: 'moonshot-v1-8k' }
}

// ── 通用 HTTPS 请求 ──
function httpsRequest(options, body) {
  return new Promise((resolve, reject) => {
    const req = https.request(options, (res) => {
      const chunks = []
      res.on('data', (chunk) => chunks.push(Buffer.from(chunk)))
      res.on('end', () => {
        const text = Buffer.concat(chunks).toString('utf8')
        if (res.statusCode >= 200 && res.statusCode < 300) {
          try { resolve(JSON.parse(text)) } catch { resolve(text) }
        } else {
          reject(new Error(`HTTP ${res.statusCode}: ${text.slice(0, 300)}`))
        }
      })
    })
    req.on('error', reject)
    if (body) req.write(typeof body === 'string' ? body : JSON.stringify(body))
    req.end()
  })
}

function postJson(url, apiKey, body) {
  const parsed = new URL(url)
  return httpsRequest({
    hostname: parsed.hostname,
    path: `${parsed.pathname}${parsed.search}`,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
      'Content-Length': Buffer.byteLength(JSON.stringify(body))
    }
  }, body)
}

// ═══════════════════════════════════════════════
//  Azure AI Search — 搜分数线、专业、学校数据
//  环境变量: AZURE_SEARCH_ENDPOINT, AZURE_SEARCH_KEY, AZURE_SEARCH_INDEX
// ═══════════════════════════════════════════════
async function searchAzure(query) {
  const endpoint = process.env.AZURE_SEARCH_ENDPOINT  // e.g. https://xxx.search.windows.net
  const key = process.env.AZURE_SEARCH_KEY
  const index = process.env.AZURE_SEARCH_INDEX || 'education-data'

  if (!endpoint || !key) return null

  const parsed = new URL(endpoint)
  const path = `/indexes/${index}/docs/search?api-version=2024-07-01`

  const result = await httpsRequest({
    hostname: parsed.hostname,
    path,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'api-key': key
    }
  }, {
    search: query,
    top: 8,
    select: 'title,content,category,province,year,source_url',
    queryType: 'semantic',
    semanticConfiguration: 'default'
  })

  if (!result || !result.value) return null

  return result.value.map(doc => ({
    title: doc.title || '',
    content: doc.content || '',
    category: doc.category || '',
    province: doc.province || '',
    year: doc.year || '',
    url: doc.source_url || ''
  }))
}

// ═══════════════════════════════════════════════
//  Bing Web Search — 搜最新政策、竞赛通知
//  环境变量: BING_SEARCH_KEY
// ═══════════════════════════════════════════════
async function searchBing(query) {
  const key = process.env.BING_SEARCH_KEY
  if (!key) return null

  const result = await httpsRequest({
    hostname: 'api.bing.microsoft.com',
    path: `/v7.0/search?q=${encodeURIComponent(query)}&mkt=zh-CN&count=6&responseFilter=Webpages`,
    method: 'GET',
    headers: { 'Ocp-Apim-Subscription-Key': key }
  })

  if (!result || !result.webPages || !result.webPages.value) return null

  return result.webPages.value.map(item => ({
    title: item.name || '',
    snippet: item.snippet || '',
    url: item.url || ''
  }))
}

// ── 组装搜索上下文 ──
function buildSearchContext(azureResults, bingResults) {
  const parts = []

  if (azureResults && azureResults.length) {
    parts.push('【教育数据库查询结果】\n' + azureResults.map(r =>
      `- ${r.title} [${r.category}${r.province ? '/' + r.province : ''}${r.year ? '/' + r.year : ''}]\n  ${r.content}\n  来源: ${r.url}`
    ).join('\n'))
  }

  if (bingResults && bingResults.length) {
    parts.push('【网络最新信息】\n' + bingResults.map(r =>
      `- ${r.title}\n  ${r.snippet}\n  ${r.url}`
    ).join('\n'))
  }

  if (!parts.length) return ''
  return '\n\n' + parts.join('\n\n') + '\n以上数据来自官方渠道，请优先参考这些数据回答用户问题。'
}

// ── 提取查询关键词（用于搜索） ──
function extractSearchQuery(userMsg) {
  if (!userMsg) return ''
  // 去掉场景标签，只保留核心查询
  return userMsg
    .replace(/【[^】]+】/g, '')
    .replace(/场景[：:][^\n]*/g, '')
    .replace(/本地分析[：:][^\n]*/g, '')
    .replace(/用户数据[：:]?/g, '')
    .replace(/\n/g, ' ')
    .trim()
    .slice(0, 200)
}

// ── fallback 兜底 ──
function fallbackAnswer(event) {
  const scene = event.scene || '成长规划'
  const map = {
    '选题比赛': '建议按"国家方向/社会需求 + 专业能力 + 可采集数据 + 可运行原型 + 可量化成效"生成选题。优先考虑数字中国、就业服务、教育数字化、养老服务、乡村振兴、绿色低碳等方向，并准备需求调研、数据字典、原型、算法说明和答辩材料。',
    '就业方向': '建议用目标岗位 JD 反推技能缺口，优先完成一个可部署项目，并把技能、项目、数据结果写进简历。面试时重点讲清项目背景、个人职责、技术取舍、问题解决和量化结果。',
    '专业方向介绍': '建议先了解该方向的行业背景、适合专业、典型岗位、核心能力和可展示作品，再决定是否作为主方向。'
  }
  return map[scene] || '建议以本省一分一段表和近年投档线为准，按位次构建冲稳保梯度，不要只看分数。'
}

// ── System Prompt ──
const systemPrompt = `你是学涯智航的升学、竞赛和就业规划助手。

数据来源说明：
- 你拥有中国教育数据库的查询权限，数据来源包括：阳光高考(gaokao.chsi.com.cn)、各省教育考试院、教育部官网、以及实时网络搜索结果。
- 你还会收到云函数内置的【轻量 MCP 工具查询结果】，这些结果来自本地结构化专业、岗位、竞赛、学习路径和官方一分一段表 JSON。
- 回答中涉及具体数据时，标注数据来源。
- 如果数据库查询到的结果与用户输入不符，以数据库结果为准并提醒用户核实。

回答规则：
- 志愿填报：必须基于一分一段表的位次来分析，不能凭空编造分数线
- 竞赛选题：结合数字中国、乡村振兴、绿色低碳、养老、教育数字化等国家方向
- 就业规划：说明岗位背景、必备能力、补弱路径、面试要点
- 专业介绍：说明学科门类、核心课程、就业方向、考研方向
- 不承诺录取、获奖或就业结果
- 回答具体、可执行、有数据支撑`

// ═══════════════════════════════════════════════
//  云函数入口
// ═══════════════════════════════════════════════
exports.main = async (event = {}) => {
  const providerName = process.env.AI_PROVIDER || 'deepseek'
  const preset = providerMap[providerName] || providerMap.deepseek
  const apiKey = process.env.AI_API_KEY
  const baseUrl = process.env.AI_BASE_URL || preset.baseUrl
  const model = process.env.AI_MODEL || preset.model

  if (event.action === 'queryGaokaoRank') {
    return {
      ok: true,
      action: 'queryGaokaoRank',
      rank: queryGaokaoRank(event.payload || event)
    }
  }

  // 提取最后一条用户消息
  let lastUserMsg = ''
  if (event.messages && Array.isArray(event.messages)) {
    for (let i = event.messages.length - 1; i >= 0; i--) {
      if (event.messages[i].role === 'user') { lastUserMsg = event.messages[i].content; break }
    }
  } else {
    lastUserMsg = `${event.scene || ''} ${event.localAnswer || ''} ${JSON.stringify(event.payload || {})}`
  }

  const searchQuery = extractSearchQuery(lastUserMsg)
  let lightToolRun = { used: false, hits: 0, results: [] }
  let lightToolError = ''

  try {
    lightToolRun = await runLightMcpTools({ query: searchQuery || lastUserMsg, event })
    console.log('[aiAdvisor] tools:', lightToolRun.used, 'hits:', lightToolRun.hits, 'query:', searchQuery)
  } catch (err) {
    lightToolError = err.message || String(err)
    console.error('[aiAdvisor] tool error:', lightToolError)
  }

  // 没有 API Key → 返回本地工具结果或兜底
  if (!apiKey) {
    return {
      ok: true,
      configured: false,
      answer: buildLocalToolAnswer(lightToolRun) || fallbackAnswer(event),
      message: '未配置 AI_API_KEY',
      lightMcpUsed: lightToolRun.used,
      toolHits: lightToolRun.hits,
      lightToolError
    }
  }

  // ── 并行搜索：Azure AI Search + Bing ──
  let azureResults = null
  let bingResults = null
  let searchError = null

  if (searchQuery) {
    try {
      const [aResult, bResult] = await Promise.allSettled([
        searchAzure(searchQuery),
        searchBing(searchQuery)
      ])
      azureResults = aResult.status === 'fulfilled' ? aResult.value : null
      bingResults = bResult.status === 'fulfilled' ? bResult.value : null
      const errors = []
      if (aResult.status === 'rejected') errors.push('Azure:' + aResult.reason?.message)
      if (bResult.status === 'rejected') errors.push('Bing:' + bResult.reason?.message)
      if (errors.length) searchError = errors.join(' ')
    } catch (e) {
      searchError = e.message
    }
  }

  const searchContext = [
    buildToolContext(lightToolRun),
    buildSearchContext(azureResults, bingResults)
  ].filter(Boolean).join('\n')

  // ── 构建消息 ──
  let messages
  if (event.messages && Array.isArray(event.messages) && event.messages.length) {
    messages = [{ role: 'system', content: systemPrompt }, ...event.messages]
    if (searchContext && messages.length > 1) {
      const last = messages[messages.length - 1]
      if (last.role === 'user') last.content += searchContext
    }
  } else {
    const userContent = [
      `场景:${event.scene || '成长规划'}`,
      `本地分析:${event.localAnswer || ''}`,
      `用户数据:${JSON.stringify(event.payload || {})}`,
      searchContext
    ].filter(Boolean).join('\n')
    messages = [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userContent }
    ]
  }

  // ── 调用 DeepSeek ──
  try {
    const result = await postJson(baseUrl, apiKey, { model, messages, temperature: 0.3 })
    const answer = result.choices?.[0]?.message?.content || fallbackAnswer(event)
    return {
      ok: true,
      configured: true,
      provider: providerName,
      model,
      answer,
      searched: !!searchQuery,
      lightMcpUsed: lightToolRun.used,
      toolHits: lightToolRun.hits,
      lightToolError,
      azureHits: azureResults ? azureResults.length : 0,
      bingHits: bingResults ? bingResults.length : 0,
      searchError
    }
  } catch (err) {
    return {
      ok: true, configured: true, provider: providerName, model,
      answer: buildLocalToolAnswer(lightToolRun) || fallbackAnswer(event),
      lightMcpUsed: lightToolRun.used,
      toolHits: lightToolRun.hits,
      lightToolError,
      message: err.message || String(err)
    }
  }
}
