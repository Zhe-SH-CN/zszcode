import type { Tool } from '../../Tool.js'

export const SuggestBackgroundPRTool: Tool = {
  name: 'SuggestBackgroundPR',
  description: 'Suggest creating a background PR for changes',
  isEnabled: () => false,
  isHidden: true,
  parameters: {},
  call: async () => {
    throw new Error('SuggestBackgroundPRTool not implemented')
  },
} as Tool
