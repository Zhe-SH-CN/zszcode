import { chromium } from 'playwright'
import { startWebServer } from '../src/zszcode/server'
import { DEFAULTS } from '../src/zszcode/config'
import { join } from 'path'
import { mkdirSync } from 'fs'

const SCREENSHOTS_DIR = join(import.meta.dir, '..', 'screenshots')
mkdirSync(SCREENSHOTS_DIR, { recursive: true })

async function testSendMessage() {
  console.log('🚀 Starting Web server...')
  const handle = startWebServer({ ...DEFAULTS, webPort: 0 })
  const url = handle.url
  console.log(`✅ Web server started: ${url}`)

  const browser = await chromium.launch({ headless: true })
  const page = await browser.newPage({ viewport: { width: 1280, height: 720 } })

  try {
    // Load page
    await page.goto(url, { waitUntil: 'networkidle', timeout: 10000 })
    await page.waitForTimeout(1000)

    // Screenshot 1: Initial state
    console.log('\n📸 Screenshot 1: Initial state...')
    await page.screenshot({ path: join(SCREENSHOTS_DIR, 'msg-01-initial.png') })

    // Type a message
    console.log('\n⌨️ Typing message...')
    const input = page.locator('textarea[placeholder*="message"]')
    await input.fill('Hello! Can you help me write a simple Python function?')
    await page.waitForTimeout(500)

    // Screenshot 2: Message typed
    console.log('📸 Screenshot 2: Message typed...')
    await page.screenshot({ path: join(SCREENSHOTS_DIR, 'msg-02-typed.png') })

    // Click Send button
    console.log('\n🖱️ Clicking Send...')
    await page.click('button:has-text("Send")')
    await page.waitForTimeout(500)

    // Screenshot 3: Message sent
    console.log('📸 Screenshot 3: Message sent...')
    await page.screenshot({ path: join(SCREENSHOTS_DIR, 'msg-03-sent.png') })

    // Wait for response (if any)
    console.log('\n⏳ Waiting for response...')
    await page.waitForTimeout(3000)

    // Screenshot 4: After wait
    console.log('📸 Screenshot 4: After wait...')
    await page.screenshot({ path: join(SCREENSHOTS_DIR, 'msg-04-response.png') })

    // Switch to Workflow Tab
    console.log('\n🔄 Switching to Workflow Tab...')
    await page.click('text=Workflow')
    await page.waitForTimeout(1000)

    // Screenshot 5: Workflow view
    console.log('📸 Screenshot 5: Workflow view...')
    await page.screenshot({ path: join(SCREENSHOTS_DIR, 'msg-05-workflow.png') })

    // Switch to Signals Tab
    console.log('\n🔄 Switching to Signals Tab...')
    await page.click('text=Signals')
    await page.waitForTimeout(1000)

    // Screenshot 6: Signals view
    console.log('📸 Screenshot 6: Signals view...')
    await page.screenshot({ path: join(SCREENSHOTS_DIR, 'msg-06-signals.png') })

    // Switch back to Chat
    console.log('\n🔄 Switching back to Chat...')
    await page.click('text=Chat')
    await page.waitForTimeout(500)

    // Final screenshot
    console.log('📸 Final screenshot...')
    await page.screenshot({ path: join(SCREENSHOTS_DIR, 'msg-07-final.png') })

    console.log('\n✅ Message send test completed!')

  } catch (error) {
    console.error('❌ Error:', error)
    await page.screenshot({ path: join(SCREENSHOTS_DIR, 'msg-error.png'), fullPage: true })
  } finally {
    await browser.close()
    handle.close()
  }
}

testSendMessage().catch(console.error)
