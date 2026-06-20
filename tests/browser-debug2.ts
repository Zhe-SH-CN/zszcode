import { chromium } from 'playwright'
import { startWebServer } from '../src/zszcode/server'
import { DEFAULTS } from '../src/zszcode/config'
import { join } from 'path'
import { mkdirSync } from 'fs'

const SCREENSHOTS_DIR = join(import.meta.dir, '..', 'screenshots')
mkdirSync(SCREENSHOTS_DIR, { recursive: true })

async function debugBrowser2() {
  console.log('🚀 Starting Web server...')
  const handle = startWebServer({ ...DEFAULTS, webPort: 0 })
  const url = handle.url
  console.log(`✅ Web server started: ${url}`)

  const browser = await chromium.launch({ headless: true })
  const page = await browser.newPage({ viewport: { width: 1280, height: 720 } })

  try {
    await page.goto(url, { waitUntil: 'networkidle', timeout: 10000 })
    await page.waitForTimeout(2000)

    // Check page structure
    const bodyHTML = await page.evaluate(() => document.body.innerHTML)
    console.log('\n📄 Body HTML (first 1000 chars):')
    console.log(bodyHTML.substring(0, 1000))

    // Find all inputs and textareas
    const inputs = await page.evaluate(() => {
      const elements = document.querySelectorAll('input, textarea')
      return Array.from(elements).map(el => ({
        tag: el.tagName,
        type: el.getAttribute('type'),
        placeholder: el.getAttribute('placeholder'),
        className: el.className,
        id: el.id,
      }))
    })
    console.log('\n📝 Input elements:', JSON.stringify(inputs, null, 2))

    // Screenshot
    await page.screenshot({ path: join(SCREENSHOTS_DIR, 'debug2-page.png'), fullPage: true })
    console.log('\n📸 Screenshot saved')

  } catch (error) {
    console.error('❌ Error:', error)
  } finally {
    await browser.close()
    handle.close()
  }
}

debugBrowser2().catch(console.error)
