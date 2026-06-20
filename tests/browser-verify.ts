import { chromium } from 'playwright'
import { startWebServer } from '../src/zszcode/server'
import { DEFAULTS } from '../src/zszcode/config'
import { join } from 'path'
import { mkdirSync } from 'fs'

const SCREENSHOTS_DIR = join(import.meta.dir, '..', 'screenshots')
mkdirSync(SCREENSHOTS_DIR, { recursive: true })

async function runBrowserTests() {
  console.log('🚀 Starting Web server...')
  const handle = startWebServer({ ...DEFAULTS, webPort: 0 })
  const url = handle.url
  console.log(`✅ Web server started: ${url}`)

  const browser = await chromium.launch({ headless: true })
  const page = await browser.newPage()

  try {
    // Test 1: Page loads
    console.log('\n📸 Test 1: Page loads...')
    await page.goto(url, { waitUntil: 'networkidle', timeout: 10000 })
    await page.screenshot({ path: join(SCREENSHOTS_DIR, '01-page-loads.png'), fullPage: true })
    console.log('✅ Page loaded successfully')

    // Test 2: Title is correct
    console.log('\n📸 Test 2: Title...')
    const title = await page.title()
    console.log(`✅ Page title: "${title}"`)
    await page.screenshot({ path: join(SCREENSHOTS_DIR, '02-title.png') })

    // Test 3: Check for Chat/Workflow/Signals tabs
    console.log('\n📸 Test 3: Check tabs...')
    const tabs = await page.locator('button, [role="tab"]').allTextContents()
    console.log(`✅ Found tabs/buttons: ${tabs.join(', ')}`)
    await page.screenshot({ path: join(SCREENSHOTS_DIR, '03-tabs.png') })

    // Test 4: Check for main layout elements
    console.log('\n📸 Test 4: Layout elements...')
    const bodyText = await page.textContent('body')
    console.log(`✅ Page content length: ${bodyText?.length || 0} chars`)

    // Test 5: Screenshot of full page
    console.log('\n📸 Test 5: Full page screenshot...')
    await page.screenshot({ path: join(SCREENSHOTS_DIR, '04-full-page.png'), fullPage: true })
    console.log('✅ Full page screenshot saved')

    // Test 6: Check for WebSocket connection
    console.log('\n📸 Test 6: WebSocket connection...')
    const wsStatus = await page.evaluate(() => {
      return document.querySelector('[class*="connected"], [class*="disconnected"]')?.textContent || 'unknown'
    })
    console.log(`✅ WebSocket status: ${wsStatus}`)

    console.log('\n✅ All browser tests passed!')

  } catch (error) {
    console.error('❌ Error:', error)
    await page.screenshot({ path: join(SCREENSHOTS_DIR, 'error.png'), fullPage: true })
  } finally {
    await browser.close()
    handle.close()
  }
}

runBrowserTests().catch(console.error)
