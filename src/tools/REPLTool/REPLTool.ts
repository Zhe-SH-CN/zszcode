import type { Tool } from '../../Tool.js'

export const REPLTool: Tool = {
  name: 'REPL',
  description: 'Interactive REPL for running code',
  isEnabled: () => false,
  isHidden: true,
  parameters: {},
  call: async () => {
    throw new Error('REPLTool not implemented')
  },
} as Tool
