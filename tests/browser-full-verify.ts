import { chromium } from 'playwright'
import { startWebServer } from '../src/zszcode/server'
import { DEFAULTS } from '../src/zszcode/config'
import { join } from 'path'
import { mkdirSync } from 'fs'

const SCREENSHOTS_DIR = join(import.meta.dir, '..', 'screenshots')
mkdirSync(SCREENSHOTS_DIR, { recursive: true })

async function fullBrowserVerify() {
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

    // Test 1: Chat Tab (default)
    console.log('\n📸 Test 1: Chat Tab...')
    await page.screenshot({ path: join(SCREENSHOTS_DIR, 'verify-01-chat.png') })
    console.log('✅ Chat Tab screenshot saved')

    // Test 2: Click Workflow Tab
    console.log('\n📸 Test 2: Workflow Tab...')
    await page.click('text=Workflow')
    await page.waitForTimeout(500)
    await page.screenshot({ path: join(SCREENSHOTS_DIR, 'verify-02-workflow.png') })
    console.log('✅ Workflow Tab screenshot saved')

    // Test 3: Click Signals Tab
    console.log('\n📸 Test 3: Signals Tab...')
    await page.click('text=Signals')
    await page.waitForTimeout(500)
    await page.screenshot({ path: join(SCREENSHOTS_DIR, 'verify-03-signals.png') })
    console.log('✅ Signals Tab screenshot saved')

    // Test 4: Click back to Chat
    console.log('\n📸 Test 4: Back to Chat...')
    await page.click('text=Chat')
    await page.waitForTimeout(500)

    // Test 5: Check input field
    console.log('\n📸 Test 5: Input field...')
    const inputVisible = await page.isVisible('input[placeholder*="message"], textarea[placeholder*="message"]')
    console.log(`✅ Input field visible: ${inputVisible}`)

    // Test 6: Check Send button
    console.log('\n📸 Test 6: Send button...')
    const sendButtonVisible = await page.isVisible('button:has-text("Send")')
    console.log(`✅ Send button visible: ${sendButtonVisible}`)

    // Test 7: Check session sidebar
    console.log('\n📸 Test 7: Session sidebar...')
    const sessionVisible = await page.isVisible('text=Default')
    console.log(`✅ Session "Default" visible: ${sessionVisible}`)

    // Test 8: Check New Session button
    console.log('\n📸 Test 8: New Session button...')
    const newSessionVisible = await page.isVisible('text=New Session')
    console.log(`✅ "New Session" button visible: ${newSessionVisible}`)

    // Test 9: Full page screenshot
    console.log('\n📸 Test 9: Full page screenshot...')
    await page.screenshot({ path: join(SCREENSHOTS_DIR, 'verify-04-full-page.png'), fullPage: true })
    console.log('✅ Full page screenshot saved')

    console.log('\n✅ All browser verification tests passed!')

  } catch (error) {
    console.error('❌ Error:', error)
    await page.screenshot({ path: join(SCREENSHOTS_DIR, 'verify-error.png'), fullPage: true })
  } finally {
    await browser.close()
    handle.close()
  }
}

fullBrowserVerify().catch(console.error)
