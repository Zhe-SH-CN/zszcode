// SDK Tool Types - Types for tool definitions and usage

export interface ToolDefinition {
  name: string
  description: string
  inputSchema: unknown
  [key: string]: unknown
}

export interface ToolAnnotations {
  title?: string
  readOnlyHint?: boolean
  destructiveHint?: boolean
  idempotentHint?: boolean
  openWorldHint?: boolean
  [key: string]: unknown
}

export interface CallToolResult {
  content: Array<{ type: string; text?: string; [key: string]: unknown }>
  isError?: boolean
  [key: string]: unknown
}
