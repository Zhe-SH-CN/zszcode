import type { Command } from '../../command.js'

const command: Command = {
  name: 'agents-platform',
  description: 'Agents platform management',
  isEnabled: () => false,
  isHidden: true,
  call: async () => {
    throw new Error('agents-platform command not implemented')
  },
}

export default command
