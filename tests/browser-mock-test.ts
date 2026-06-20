import { chromium } from 'playwright'
import { startWebServer } from '../src/zszcode/server'
import { eventBus } from '../src/zszcode/events'
import { DEFAULTS } from '../src/zszcode/config'
import { join } from 'path'
import { mkdirSync } from 'fs'

const SCREENSHOTS_DIR = join(import.meta.dir, '..', 'screenshots')
mkdirSync(SCREENSHOTS_DIR, { recursive: true })

async function mockTest() {
  console.log('🚀 Starting Web server...')
  const handle = startWebServer({ ...DEFAULTS, webPort: 0 })
  const url = handle.url
  console.log(`✅ Web server started: ${url}`)

  // Simulate agent loop events
  console.log('\n🔄 Simulating agent events...')
  setTimeout(() => {
    eventBus.emit({ type: 'agent_spawn', timestamp: Date.now(), parentId: 'root', childId: 'main', agentType: 'main', description: 'Main agent' })
    eventBus.emit({ type: 'turn_start', timestamp: Date.now(), turnNumber: 1 })
    eventBus.emit({ type: 'api_stream_start', timestamp: Date.now(), model: 'mimo-v2.5-pro' })
    eventBus.emit({ type: 'api_stream_end', timestamp: Date.now(), duration: 1500, tokens: 150 })
    eventBus.emit({ type: 'tool_call_start', timestamp: Date.now(), toolName: 'BashTool', toolUseId: '123', input: { command: 'echo hello' } })
    eventBus.emit({ type: 'tool_call_end', timestamp: Date.now(), toolName: 'BashTool', toolUseId: '123', success: true, duration: 500 })
    eventBus.emit({ type: 'agent_complete', timestamp: Date.now(), agentId: 'main', duration: 2000 })
    eventBus.emit({ type: 'turn_end', timestamp: Date.now(), turnNumber: 1 })
  }, 2000)

  const browser = await chromium.launch({ headless: true })
  const page = await browser.newPage({ viewport: { width: 1280, height: 720 } })

  try {
    await page.goto(url, { waitUntil: 'networkidle', timeout: 10000 })
    await page.waitForTimeout(1000)

    // Screenshot 1: Initial state
    console.log('\n📸 Screenshot 1: Initial state...')
    await page.screenshot({ path: join(SCREENSHOTS_DIR, 'mock-01-initial.png') })

    // Type a message
    console.log('\n⌨️ Typing message...')
    const input = page.locator('textarea[placeholder*="message"]')
    await input.fill('Hello! Can you help me write a simple Python function?')
    await page.waitForTimeout(500)

    // Click Send
    console.log('\n🖱️ Clicking Send...')
    await page.click('button:has-text("Send")')
    await page.waitForTimeout(500)

    // Screenshot 2: Message sent
    console.log('📸 Screenshot 2: Message sent...')
    await page.screenshot({ path: join(SCREENSHOTS_DIR, 'mock-02-sent.png') })

    // Wait for simulated events
    console.log('\n⏳ Waiting for events...')
    await page.waitForTimeout(3000)

    // Screenshot 3: After events
    console.log('📸 Screenshot 3: After events...')
    await page.screenshot({ path: join(SCREENSHOTS_DIR, 'mock-03-events.png') })

    // Switch to Workflow Tab
    console.log('\n🔄 Switching to Workflow Tab...')
    await page.click('text=Workflow')
    await page.waitForTimeout(1000)

    // Screenshot 4: Workflow view
    console.log('📸 Screenshot 4: Workflow view...')
    await page.screenshot({ path: join(SCREENSHOTS_DIR, 'mock-04-workflow.png') })

    // Switch to Signals Tab
    console.log('\n🔄 Switching to Signals Tab...')
    await page.click('text=Signals')
    await page.waitForTimeout(1000)

    // Screenshot 5: Signals view
    console.log('📸 Screenshot 5: Signals view...')
    await page.screenshot({ path: join(SCREENSHOTS_DIR, 'mock-05-signals.png') })

    console.log('\n✅ Mock test completed!')

  } catch (error) {
    console.error('❌ Error:', error)
    await page.screenshot({ path: join(SCREENSHOTS_DIR, 'mock-error.png'), fullPage: true })
  } finally {
    await browser.close()
    handle.close()
  }
}

mockTest().catch(console.error)
