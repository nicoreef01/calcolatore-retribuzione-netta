// Screenshot fedele + test interattivo via CDP.
// Uso: node scripts/shot.mjs <url> <width> <height> <outfile> [clickSelector] [waitAfterMs]
const [url, widthArg, heightArg, outFile, clickSelector = '', waitAfter = '400'] = process.argv.slice(2)
const width = Number(widthArg)
const height = Number(heightArg)

const { spawn } = await import('node:child_process')
const { writeFileSync } = await import('node:fs')
const edge = 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe'
const proc = spawn(edge, [
  '--headless=new', '--disable-gpu', '--no-first-run',
  '--remote-debugging-port=9334', `--window-size=${width},${height}`, 'about:blank',
], { stdio: 'ignore' })

async function waitPort() {
  for (let i = 0; i < 40; i++) {
    try {
      const res = await fetch('http://127.0.0.1:9334/json/list')
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
await new Promise((r) => setTimeout(r, 1200))

if (clickSelector) {
  await send('Runtime.evaluate', {
    expression: `document.querySelector(${JSON.stringify(clickSelector)})?.click()`,
  })
  await new Promise((r) => setTimeout(r, Number(waitAfter)))
}

const { result: shot } = await send('Page.captureScreenshot', { format: 'png' })
writeFileSync(outFile, Buffer.from(shot.data, 'base64'))
console.log('written', outFile)
ws.close()
proc.kill()
