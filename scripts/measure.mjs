// Diagnostica: misura overflow e elementi più larghi del viewport via CDP.
// Uso: node scripts/measure.mjs <url> <width> [height]
const [url = 'http://localhost:4173/', widthArg = '375', heightArg = '800'] = process.argv.slice(2)
const width = Number(widthArg)
const height = Number(heightArg)

const { spawn } = await import('node:child_process')
const edge = 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe'
const proc = spawn(edge, [
  '--headless=new',
  '--disable-gpu',
  '--no-first-run',
  `--remote-debugging-port=9333`,
  `--window-size=${width},${height}`,
  'about:blank',
], { stdio: 'ignore' })

async function waitPort() {
  for (let i = 0; i < 40; i++) {
    try {
      const res = await fetch('http://127.0.0.1:9333/json/list')
      const targets = await res.json()
      const page = targets.find((t) => t.type === 'page' && t.webSocketDebuggerUrl)
      if (page) return page.webSocketDebuggerUrl
    } catch {}
    await new Promise((r) => setTimeout(r, 250))
  }
  throw new Error('CDP non raggiungibile')
}

const wsUrl = await waitPort()
const ws = new WebSocket(wsUrl)
await new Promise((resolve, reject) => { ws.onopen = resolve; ws.onerror = reject })

let id = 0
const pending = new Map()
ws.onmessage = (event) => {
  const msg = JSON.parse(event.data)
  if (msg.id && pending.has(msg.id)) {
    pending.get(msg.id)(msg)
    pending.delete(msg.id)
  }
}

function send(method, params = {}) {
  return new Promise((resolve) => {
    const msgId = ++id
    pending.set(msgId, resolve)
    ws.send(JSON.stringify({ id: msgId, method, params }))
  })
}

await send('Page.enable')
await send('Emulation.setDeviceMetricsOverride', {
  width, height, deviceScaleFactor: 1, mobile: width < 600,
})
await send('Page.navigate', { url })
await new Promise((r) => setTimeout(r, 1500))

const { result } = await send('Runtime.evaluate', { expression: `(() => {
  const doc = document.documentElement
  const out = { scrollWidth: doc.scrollWidth, clientWidth: doc.clientWidth, offenders: [] }
  const all = document.querySelectorAll('*')
  for (const el of all) {
    const rect = el.getBoundingClientRect()
    if (rect.right > doc.clientWidth + 1 || rect.width > doc.clientWidth + 1) {
      out.offenders.push({
        tag: el.tagName.toLowerCase(),
        cls: String(el.className && el.className.baseVal !== undefined ? el.className.baseVal : el.className).slice(0, 60),
        right: Math.round(rect.right),
        width: Math.round(rect.width),
        scrollW: el.scrollWidth,
      })
    }
  }
  out.offenders.sort((a, b) => b.right - a.right)
  return JSON.stringify(out, null, 1)
})()`, returnByValue: true })

console.log(result.result.value)
ws.close()
proc.kill()
