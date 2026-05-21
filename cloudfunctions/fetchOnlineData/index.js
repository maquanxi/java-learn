const https = require('https')
const http = require('http')
const { TextDecoder } = require('util')

function decodeBody(buffer, headers = {}) {
  const contentType = headers['content-type'] || headers['Content-Type'] || ''
  const match = String(contentType).match(/charset=([^;]+)/i)
  const charset = match ? match[1].trim().toLowerCase() : 'utf-8'
  const candidates = charset.includes('gb') ? [charset, 'gb18030', 'gbk', 'utf-8'] : [charset, 'utf-8', 'gb18030', 'gbk']
  for (let i = 0; i < candidates.length; i += 1) {
    try {
      return new TextDecoder(candidates[i]).decode(buffer)
    } catch (err) {}
  }
  return buffer.toString('utf8')
}

function fetchText(targetUrl, redirectCount = 0) {
  const parsed = new URL(targetUrl)
  const client = parsed.protocol === 'https:' ? https : http
  const options = {
    protocol: parsed.protocol,
    hostname: parsed.hostname,
    port: parsed.port,
    path: `${parsed.pathname}${parsed.search}`,
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120 Safari/537.36',
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
      'Accept-Language': 'zh-CN,zh;q=0.9',
      'Cache-Control': 'no-cache',
      'Referer': `${parsed.protocol}//${parsed.hostname}/`
    }
  }
  return new Promise((resolve, reject) => {
    client.get(options, (res) => {
      if ([301, 302, 303, 307, 308].includes(res.statusCode) && res.headers.location && redirectCount < 3) {
        const nextUrl = new URL(res.headers.location, targetUrl).toString()
        resolve(fetchText(nextUrl, redirectCount + 1))
        return
      }
      const chunks = []
      res.on('data', (chunk) => { chunks.push(Buffer.from(chunk)) })
      res.on('end', () => {
        const html = decodeBody(Buffer.concat(chunks), res.headers)
        if (res.statusCode >= 200 && res.statusCode < 400) resolve(html)
        else reject(new Error(`HTTP ${res.statusCode}`))
      })
    }).on('error', reject)
  })
}

exports.main = async (event = {}) => {
  if (!event.url || !/^https?:\/\//.test(event.url)) {
    return { ok: false, message: '缺少合法数据源 URL' }
  }
  try {
    const html = await fetchText(event.url)
    return { ok: true, url: event.url, html: html.slice(0, 200000) }
  } catch (err) {
    return { ok: false, url: event.url, message: err.message || String(err) }
  }
}
