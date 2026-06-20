// Stub for @ant/claude-for-chrome-mcp — an internal Anthropic package not published to npm.
// Provides the minimal exports needed for the build to succeed.

export const BROWSER_TOOLS = [
  'javascript_tool',
  'read_page',
  'find',
  'form_input',
  'computer',
  'navigate',
  'resize_window',
  'gif_creator',
  'upload_image',
  'get_page_text',
  'tabs_context_mcp',
  'tabs_create_mcp',
  'update_plan',
  'read_console_messages',
  'read_network_requests',
  'shortcuts_list',
  'shortcuts_execute',
]

export type PermissionMode = 'auto' | 'confirm'

export interface Logger {
  info: (...args: unknown[]) => void
  warn: (...args: unknown[]) => void
  error: (...args: unknown[]) => void
  debug: (...args: unknown[]) => void
}

export interface ClaudeForChromeContext {
  getSocketPaths: () => string[]
}

export function createClaudeForChromeMcpServer(_opts: {
  context: ClaudeForChromeContext
  logger: Logger
  permissionMode: PermissionMode
}) {
  throw new Error('@ant/claude-for-chrome-mcp is not available in external builds')
}
