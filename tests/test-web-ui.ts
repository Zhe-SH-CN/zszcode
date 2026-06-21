import { chromium } from 'playwright'
import { startWebServer } from '../src/zszcode/server'
import { eventBus } from '../src/zszcode/events'
import { DEFAULTS } from '../src/zszcode/config'
import { join } from 'path'
import { mkdirSync } from 'fs'

const SCREENSHOTS_DIR = join(import.meta.dir, '..', 'screenshots')
mkdirSync(SCREENSHOTS_DIR, { recursive: true })

async function testWebUI() {
  console.log('🚀 Starting Web server...')
  const handle = startWebServer({ ...DEFAULTS, webPort: 0 })
  const url = handle.url
  console.log(`✅ Web server started: ${url}`)

  // Simulate a real agent processing messages
  console.log('\n🔄 Setting up event simulation...')

  // Simulate agent receiving and processing a message
  let messageReceived = false
  eventBus.on('event', (event: any) => {
    if (event.type === 'message' && event.role === 'user') {
      console.log('📨 Received user message:', event.content)
      messageReceived = true

      // Simulate agent processing
      setTimeout(() => {
        console.log('🤖 Simulating agent response...')
        eventBus.emit({ type: 'turn_start', timestamp: Date.now(), turnNumber: 1 })
        eventBus.emit({ type: 'api_stream_start', timestamp: Date.now(), model: 'mimo-v2.5-pro' })
        eventBus.emit({ type: 'message', timestamp: Date.now(), role: 'assistant', content: 'I can help you write a Python function! Here\'s a simple example:\n\n```python\ndef greet(name):\n    return f"Hello, {name}!"\n```\n\nThis function takes a name parameter and returns a greeting string.' })
        eventBus.emit({ type: 'api_stream_end', timestamp: Date.now(), duration: 1500, tokens: 150 })
        eventBus.emit({ type: 'turn_end', timestamp: Date.now(), turnNumber: 1, duration: 1500, inputTokens: 150, outputTokens: 200, cost: 0.001, stopReason: 'end_turn' })
      }, 1000)
    }
  })

  const browser = await chromium.launch({ headless: true })
  const page = await browser.newPage({ viewport: { width: 1280, height: 720 } })

  try {
    // Load page
    console.log('\n📸 Loading page...')
    await page.goto(url, { waitUntil: 'networkidle', timeout: 10000 })
    await page.waitForTimeout(1000)

    // Screenshot 1: Initial state
    console.log('📸 Screenshot 1: Initial state')
    await page.screenshot({ path: join(SCREENSHOTS_DIR, 'real-01-initial.png') })

    // Type a message
    console.log('\n⌨️ Typing message...')
    const input = page.locator('textarea[placeholder*="message"]')
    await input.fill('Hello! Can you help me write a simple Python function?')
    await page.waitForTimeout(500)

    // Screenshot 2: Message typed
    console.log('📸 Screenshot 2: Message typed')
    await page.screenshot({ path: join(SCREENSHOTS_DIR, 'real-02-typed.png') })

    // Click Send
    console.log('\n🖱️ Clicking Send...')
    await page.click('button:has-text("Send")')
    await page.waitForTimeout(500)

    // Screenshot 3: Message sent
    console.log('📸 Screenshot 3: Message sent')
    await page.screenshot({ path: join(SCREENSHOTS_DIR, 'real-03-sent.png') })

    // Wait for response
    console.log('\n⏳ Waiting for response...')
    await page.waitForTimeout(3000)

    // Screenshot 4: Response received
    console.log('📸 Screenshot 4: Response received')
    await page.screenshot({ path: join(SCREENSHOTS_DIR, 'real-04-response.png') })

    // Check if message was received
    console.log(`\n✅ Message received by server: ${messageReceived}`)

    // Switch to Workflow Tab
    console.log('\n🔄 Switching to Workflow Tab...')
    await page.click('text=Workflow')
    await page.waitForTimeout(1000)

    // Screenshot 5: Workflow view
    console.log('📸 Screenshot 5: Workflow view')
    await page.screenshot({ path: join(SCREENSHOTS_DIR, 'real-05-workflow.png') })

    // Switch to Signals Tab
    console.log('\n🔄 Switching to Signals Tab...')
    await page.click('text=Signals')
    await page.waitForTimeout(1000)

    // Screenshot 6: Signals view
    console.log('📸 Screenshot 6: Signals view')
    await page.screenshot({ path: join(SCREENSHOTS_DIR, 'real-06-signals.png') })

    console.log('\n✅ Test completed!')

  } catch (error) {
    console.error('❌ Error:', error)
    await page.screenshot({ path: join(SCREENSHOTS_DIR, 'real-error.png'), fullPage: true })
  } finally {
    await browser.close()
    handle.close()
  }
}

testWebUI().catch(console.error)
