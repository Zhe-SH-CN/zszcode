// TungstenTool types

export interface TungstenSession {
  id: string
  name: string
  [key: string]: unknown
}

export interface TungstenCommand {
  command: string
  args?: string[]
  [key: string]: unknown
}

export interface TungstenResult {
  output: string
  exitCode: number
  [key: string]: unknown
}
