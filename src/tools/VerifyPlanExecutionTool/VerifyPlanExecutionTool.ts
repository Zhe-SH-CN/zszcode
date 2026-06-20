import type { Tool } from '../../Tool.js'

export const VerifyPlanExecutionTool: Tool = {
  name: 'VerifyPlanExecution',
  description: 'Verify plan execution results',
  isEnabled: () => false,
  isHidden: true,
  parameters: {},
  call: async () => {
    throw new Error('VerifyPlanExecutionTool not implemented')
  },
} as Tool
