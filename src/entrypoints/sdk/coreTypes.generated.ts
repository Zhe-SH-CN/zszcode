// Generated core types for MCP
// Stub file - types are generated from Zod schemas

export interface SDKMessage {
  type: string
  [key: string]: unknown
}

export interface SDKResultMessage {
  type: string
  [key: string]: unknown
}

export interface SDKSessionInfo {
  sessionId: string
  [key: string]: unknown
}

export interface SDKUserMessage {
  type: string
  [key: string]: unknown
}

export interface ToolAnnotations {
  [key: string]: unknown
}

export interface CallToolResult {
  content: unknown[]
  [key: string]: unknown
}

export interface McpSdkServerConfigWithInstance {
  [key: string]: unknown
}
