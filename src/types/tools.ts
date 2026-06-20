/**
 * Tool progress type definitions.
 *
 * These are stub types extracted to break import cycles.
 */

// ============================================================================
// Base progress type
// ============================================================================

export type ToolProgressData = {
  type: string
  [key: string]: unknown
}

// ============================================================================
// Shell progress
// ============================================================================

export type ShellProgress = ToolProgressData & {
  type: 'shell'
  output?: string
  exitCode?: number
  isRunning?: boolean
  command?: string
}

// ============================================================================
// Bash progress
// ============================================================================

export type BashProgress = ShellProgress & {
  type: 'bash'
}

// ============================================================================
// PowerShell progress
// ============================================================================

export type PowerShellProgress = ShellProgress & {
  type: 'powershell'
}

// ============================================================================
// Agent tool progress
// ============================================================================

export type AgentToolProgress = ToolProgressData & {
  type: 'agent'
  agentType?: string
  status?: string
  output?: string
}

// ============================================================================
// MCP progress
// ============================================================================

export type MCPProgress = ToolProgressData & {
  type: 'mcp'
  serverName?: string
  toolName?: string
  status?: string
}

// ============================================================================
// Web search progress
// ============================================================================

export type WebSearchProgress = ToolProgressData & {
  type: 'web_search'
  query?: string
  results?: unknown[]
}

// ============================================================================
// Skill tool progress
// ============================================================================

export type SkillToolProgress = ToolProgressData & {
  type: 'skill'
  skillName?: string
  status?: string
}

// ============================================================================
// Task output progress
// ============================================================================

export type TaskOutputProgress = ToolProgressData & {
  type: 'task_output'
  taskId?: string
  status?: string
}

// ============================================================================
// REPL tool progress
// ============================================================================

export type REPLToolProgress = ToolProgressData & {
  type: 'repl'
}

// ============================================================================
// SDK workflow progress
// ============================================================================

export type SdkWorkflowProgress = ToolProgressData & {
  type: 'sdk_workflow'
  workflowId?: string
  status?: string
  step?: string
}
