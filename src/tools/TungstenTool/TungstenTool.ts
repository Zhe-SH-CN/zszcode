// Stub for TungstenTool — an internal Anthropic tool not available in external builds.
import type { Tool } from '../../Tool.js'

export const TungstenTool: Tool = {
  name: 'TungstenTool',
  description: 'Internal tool (not available in external builds)',
  inputSchema: { type: 'object' as const, properties: {} },
  isEnabled: () => false,
  isHidden: () => true,
  needsPermissions: () => false,
  async call() {
    throw new Error('TungstenTool is not available in external builds')
  },
}
