import { chromium } from 'playwright'
import { startWebServer } from '../src/zszcode/server'
import { DEFAULTS } from '../src/zszcode/config'
import { join } from 'path'
import { mkdirSync } from 'fs'

const SCREENSHOTS_DIR = join(import.meta.dir, '..', 'screenshots')
mkdirSync(SCREENSHOTS_DIR, { recursive: true })

async function debugBrowser() {
  console.log('🚀 Starting Web server...')
  const handle = startWebServer({ ...DEFAULTS, webPort: 0 })
  const url = handle.url
  console.log(`✅ Web server started: ${url}`)

  const browser = await chromium.launch({ headless: true })
  const page = await browser.newPage()

  // Capture console messages
  const consoleLogs: string[] = []
  page.on('console', msg => {
    consoleLogs.push(`[${msg.type()}] ${msg.text()}`)
  })

  // Capture page errors
  const pageErrors: string[] = []
  page.on('pageerror', error => {
    pageErrors.push(error.message)
  })

  try {
    console.log('\n📸 Loading page...')
    await page.goto(url, { waitUntil: 'networkidle', timeout: 15000 })

    // Wait a bit for React to render
    await page.waitForTimeout(2000)

    // Check page content
    const bodyHTML = await page.evaluate(() => document.body.innerHTML)
    console.log('\n📄 Body HTML (first 500 chars):')
    console.log(bodyHTML.substring(0, 500))

    // Check if JS files loaded
    const scripts = await page.evaluate(() => {
      return Array.from(document.querySelectorAll('script')).map(s => s.src || s.textContent?.substring(0, 100))
    })
    console.log('\n📜 Scripts:', scripts)

    // Check for errors
    console.log('\n🔴 Console logs:')
    consoleLogs.forEach(log => console.log('  ', log))

    console.log('\n❌ Page errors:')
    pageErrors.forEach(err => console.log('  ', err))

    // Screenshot
    await page.screenshot({ path: join(SCREENSHOTS_DIR, 'debug-page.png'), fullPage: true })
    console.log('\n📸 Screenshot saved to screenshots/debug-page.png')

    // Check network requests
    const failedRequests: string[] = []
    page.on('requestfailed', request => {
      failedRequests.push(`${request.url()} - ${request.failure()?.errorText}`)
    })

  } catch (error) {
    console.error('❌ Error:', error)
  } finally {
    await browser.close()
    handle.close()
  }
}

debugBrowser().catch(console.error)
