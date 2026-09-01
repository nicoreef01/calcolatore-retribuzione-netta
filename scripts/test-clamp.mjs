// Verifica clamp al blur con eventi reali: digita 999000 → blur → atteso 250.000.
const { spawn } = await import('node:child_process')
const edge = 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe'
const proc = spawn(edge, [
  '--headless=new', '--disable-gpu', '--no-first-run',
  `--user-data-dir=${process.env.TEMP}/edge-clamp-${Date.now()}`,
  '--remote-debugging-port=9338', '--window-size=1440,900', 'about:blank',
], { stdio: 'ignore' })

async function waitPort() {
  for (let i = 0; i < 40; i++) {
    try {
      const res = await fetch('http://127.0.0.1:9338/json/list')
      const targets = await res.json()
      const page = targets.find((t) => t.type === 'page' && t.webSocketDebuggerUrl)
      if (page) return page.webSocketDebuggerUrl
    } catch {}
    await new Promise((r) => setTimeout(r, 250))
  }
  throw new Error('CDP non raggiungibile')
}

const ws = new WebSocket(await waitPort())
await new Promise((resolve, reject) => { ws.onopen = resolve; ws.onerror = reject })
let id = 0
const pending = new Map()
ws.onmessage = (event) => {
  const msg = JSON.parse(event.data)
  if (msg.id && pending.has(msg.id)) { pending.get(msg.id)(msg); pending.delete(msg.id) }
}
function send(method, params = {}) {
  return new Promise((resolve) => {
    const msgId = ++id
    pending.set(msgId, resolve)
    ws.send(JSON.stringify({ id: msgId, method, params }))
  })
}

await send('Page.enable')
await send('Page.navigate', { url: 'http://localhost:4173/' })
await new Promise((r) => setTimeout(r, 1500))

async function evalRaw(expression) {
  const { result, exceptionDetails } = await send('Runtime.evaluate', { expression, returnByValue: true })
  if (exceptionDetails) return 'ERR: ' + (exceptionDetails.exception?.description ?? '?')
  return result.result.value
}

const { result: q } = await send('Runtime.evaluate', {
  expression: `JSON.stringify(document.querySelector('.salary-input__control').getBoundingClientRect())`,
  returnByValue: true,
})
const rect = JSON.parse(q.result.value)
const cx = Math.round(rect.x + 100)
const cy = Math.round(rect.y + rect.height / 2)

async function clickInput() {
  await send('Input.dispatchMouseEvent', { type: 'mousePressed', x: cx, y: cy, button: 'left', clickCount: 1 })
  await send('Input.dispatchMouseEvent', { type: 'mouseReleased', x: cx, y: cy, button: 'left', clickCount: 1 })
  await new Promise((r) => setTimeout(r, 150))
}
async function selectAll() {
  await send('Input.dispatchKeyEvent', { type: 'keyDown', key: 'a', code: 'KeyA', modifiers: 2, windowsVirtualKeyCode: 65 })
  await send('Input.dispatchKeyEvent', { type: 'keyUp', key: 'a', code: 'KeyA', modifiers: 2, windowsVirtualKeyCode: 65 })
}
async function type(text) {
  for (const ch of text) {
    await send('Input.dispatchKeyEvent', { type: 'keyDown', key: ch, code: '', text: ch })
    await send('Input.dispatchKeyEvent', { type: 'keyUp', key: ch, code: '', text: ch })
  }
}

// Caso 1: 999000 → hint → blur → clamp 250.000
await clickInput()
await selectAll()
await type('999000')
await new Promise((r) => setTimeout(r, 250))
console.log('hint visible (999000):', await evalRaw(`getComputedStyle(document.querySelector('.salary-input__hint')).display !== 'none'`))
console.log('value while typing:', await evalRaw(`document.querySelector('.salary-input__control').value`))
// blur: click fuori
await send('Input.dispatchMouseEvent', { type: 'mousePressed', x: 700, y: 700, button: 'left', clickCount: 1 })
await send('Input.dispatchMouseEvent', { type: 'mouseReleased', x: 700, y: 700, button: 'left', clickCount: 1 })
await new Promise((r) => setTimeout(r, 300))
console.log('after blur (clamp):', await evalRaw(`JSON.stringify({ value: document.querySelector('.salary-input__control').value, annual: document.querySelectorAll('.salary-result__amount')[1].textContent.trim() })`))

// Caso 2: testo non numerico → blur → ripristino
await clickInput()
await selectAll()
await type('abc')
await new Promise((r) => setTimeout(r, 250))
await send('Input.dispatchMouseEvent', { type: 'mousePressed', x: 700, y: 700, button: 'left', clickCount: 1 })
await send('Input.dispatchMouseEvent', { type: 'mouseReleased', x: 700, y: 700, button: 'left', clickCount: 1 })
await new Promise((r) => setTimeout(r, 300))
console.log('after non-numeric blur:', await evalRaw(`JSON.stringify({ value: document.querySelector('.salary-input__control').value, annual: document.querySelectorAll('.salary-result__amount')[1].textContent.trim() })`))

// Caso 3: sotto il minimo (5000) → clamp a 10.000
await clickInput()
await selectAll()
await type('5000')
await new Promise((r) => setTimeout(r, 250))
await send('Input.dispatchMouseEvent', { type: 'mousePressed', x: 700, y: 700, button: 'left', clickCount: 1 })
await send('Input.dispatchMouseEvent', { type: 'mouseReleased', x: 700, y: 700, button: 'left', clickCount: 1 })
await new Promise((r) => setTimeout(r, 300))
console.log('after low blur (clamp to 10000):', await evalRaw(`JSON.stringify({ value: document.querySelector('.salary-input__control').value, annual: document.querySelectorAll('.salary-result__amount')[1].textContent.trim() })`))

ws.close()
proc.kill()
