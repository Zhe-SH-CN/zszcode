import { chromium } from 'playwright'
import { startWebServer } from '../src/zszcode/server'
import { eventBus } from '../src/zszcode/events'
import { DEFAULTS } from '../src/zszcode/config'
import { join } from 'path'
import { mkdirSync } from 'fs'

const SCREENSHOTS_DIR = join(import.meta.dir, '..', 'screenshots')
mkdirSync(SCREENSHOTS_DIR, { recursive: true })

async function testWorkflow() {
  console.log('🚀 Starting Web server...')
  const handle = startWebServer({ ...DEFAULTS, webPort: 0 })
  const url = handle.url
  console.log(`✅ Web server started: ${url}`)

  // Simulate a full agent workflow
  console.log('\n🔄 Setting up workflow simulation...')

  // Simulate agent spawning
  setTimeout(() => {
    console.log('🤖 Simulating agent workflow...')

    // Agent spawn
    eventBus.emit({
      type: 'agent_spawn',
      timestamp: Date.now(),
      parentId: 'root',
      childId: 'main-agent',
      agentType: 'main',
      description: 'Main agent processing user request'
    })

    // Turn start
    eventBus.emit({ type: 'turn_start', timestamp: Date.now(), turnNumber: 1 })

    // API call
    eventBus.emit({ type: 'api_stream_start', timestamp: Date.now(), model: 'mimo-v2.5-pro' })

    // Tool calls
    eventBus.emit({
      type: 'tool_call_start',
      timestamp: Date.now(),
      toolName: 'BashTool',
      toolUseId: 'tool-1',
      input: { command: 'ls -la' },
      agentId: 'main-agent'
    })

    setTimeout(() => {
      eventBus.emit({
        type: 'tool_call_end',
        timestamp: Date.now(),
        toolName: 'BashTool',
        toolUseId: 'tool-1',
        success: true,
        duration: 150,
        output: 'total 48\ndrwxr-xr-x  8 zsz staff  256 Jun 21 09:00 .\n'
      })
    }, 200)

    // Another tool call
    eventBus.emit({
      type: 'tool_call_start',
      timestamp: Date.now(),
      toolName: 'FileReadTool',
      toolUseId: 'tool-2',
      input: { file_path: '/test/file.py' },
      agentId: 'main-agent'
    })

    setTimeout(() => {
      eventBus.emit({
        type: 'tool_call_end',
        timestamp: Date.now(),
        toolName: 'FileReadTool',
        toolUseId: 'tool-2',
        success: true,
        duration: 50,
        output: 'def hello():\n    print("Hello, World!")\n'
      })
    }, 100)

    // Message
    eventBus.emit({
      type: 'message',
      timestamp: Date.now(),
      role: 'assistant',
      content: 'I found the Python file. Here\'s the code:\n\n```python\ndef hello():\n    print("Hello, World!")\n```\n\nThis function prints a greeting message.'
    })

    // API stream end
    eventBus.emit({ type: 'api_stream_end', timestamp: Date.now(), duration: 2000, tokens: 500 })

    // Agent complete
    eventBus.emit({
      type: 'agent_complete',
      timestamp: Date.now(),
      agentId: 'main-agent',
      duration: 2500
    })

    // Turn end
    eventBus.emit({
      type: 'turn_end',
      timestamp: Date.now(),
      turnNumber: 1,
      duration: 2500,
      inputTokens: 300,
      outputTokens: 200,
      cost: 0.002,
      stopReason: 'end_turn'
    })
  }, 1000)

  const browser = await chromium.launch({ headless: true })
  const page = await browser.newPage({ viewport: { width: 1280, height: 720 } })

  try {
    // Load page
    console.log('\n📸 Loading page...')
    await page.goto(url, { waitUntil: 'networkidle', timeout: 10000 })
    await page.waitForTimeout(1000)

    // Screenshot 1: Initial state
    console.log('📸 Screenshot 1: Initial state')
    await page.screenshot({ path: join(SCREENSHOTS_DIR, 'workflow-01-initial.png') })

    // Wait for workflow simulation
    console.log('\n⏳ Waiting for workflow...')
    await page.waitForTimeout(4000)

    // Screenshot 2: Chat with response
    console.log('📸 Screenshot 2: Chat with response')
    await page.screenshot({ path: join(SCREENSHOTS_DIR, 'workflow-02-chat.png') })

    // Switch to Workflow Tab
    console.log('\n🔄 Switching to Workflow Tab...')
    await page.click('text=Workflow')
    await page.waitForTimeout(1000)

    // Screenshot 3: Workflow view
    console.log('📸 Screenshot 3: Workflow view')
    await page.screenshot({ path: join(SCREENSHOTS_DIR, 'workflow-03-workflow.png') })

    // Click on Details button
    console.log('\n🖱️ Clicking Details...')
    const detailsButton = page.locator('text=Details')
    if (await detailsButton.isVisible()) {
      await detailsButton.click()
      await page.waitForTimeout(500)
    }

    // Screenshot 4: Workflow details
    console.log('📸 Screenshot 4: Workflow details')
    await page.screenshot({ path: join(SCREENSHOTS_DIR, 'workflow-04-details.png') })

    // Switch to Signals Tab
    console.log('\n🔄 Switching to Signals Tab...')
    await page.click('text=Signals')
    await page.waitForTimeout(1000)

    // Screenshot 5: Signals view
    console.log('📸 Screenshot 5: Signals view')
    await page.screenshot({ path: join(SCREENSHOTS_DIR, 'workflow-05-signals.png') })

    console.log('\n✅ Workflow test completed!')

  } catch (error) {
    console.error('❌ Error:', error)
    await page.screenshot({ path: join(SCREENSHOTS_DIR, 'workflow-error.png'), fullPage: true })
  } finally {
    await browser.close()
    handle.close()
  }
}

testWorkflow().catch(console.error)
