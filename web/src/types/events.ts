/** Frontend copy of ZszCodeEvent types (mirrors src/zszcode/events.ts) */

export type ZszCodeEventType =
  | 'api_stream_start'
  | 'api_stream_event'
  | 'api_stream_end'
  | 'tool_call_start'
  | 'tool_call_end'
  | 'tool_permission_request'
  | 'tool_permission_resolved'
  | 'agent_spawn'
  | 'agent_complete'
  | 'mcp_connect'
  | 'mcp_call'
  | 'skill_load'
  | 'skill_invoke'
  | 'state_change'
  | 'context_compact'
  | 'hook_fire'
  | 'message'
  | 'turn_start'
  | 'turn_end'

export interface BaseEvent {
  type: ZszCodeEventType
  timestamp: number
}

export interface ApiStreamStartEvent extends BaseEvent {
  type: 'api_stream_start'
  model: string
}

export interface ApiStreamEvent extends BaseEvent {
  type: 'api_stream_event'
  data: unknown
}

export interface ApiStreamEndEvent extends BaseEvent {
  type: 'api_stream_end'
  duration: number
  tokens: number
}

export interface ToolCallStartEvent extends BaseEvent {
  type: 'tool_call_start'
  toolName: string
  toolUseId: string
  input: unknown
  agentId?: string
}

export interface ToolCallEndEvent extends BaseEvent {
  type: 'tool_call_end'
  toolName: string
  toolUseId: string
  success: boolean
  duration: number
  output?: unknown
}

export interface ToolPermissionRequestEvent extends BaseEvent {
  type: 'tool_permission_request'
  toolName: string
  toolUseId: string
  input: unknown
}

export interface ToolPermissionResolvedEvent extends BaseEvent {
  type: 'tool_permission_resolved'
  toolUseId: string
  decision: string
  source: string
}

export interface AgentSpawnEvent extends BaseEvent {
  type: 'agent_spawn'
  parentId: string
  childId: string
  agentType: string
  description: string
}

export interface AgentCompleteEvent extends BaseEvent {
  type: 'agent_complete'
  agentId: string
  duration: number
  success?: boolean
}

export interface McpConnectEvent extends BaseEvent {
  type: 'mcp_connect'
  serverName: string
  success: boolean
}

export interface McpCallEvent extends BaseEvent {
  type: 'mcp_call'
  serverName: string
  toolName: string
  request: unknown
  response?: unknown
  duration?: number
}

export interface SkillLoadEvent extends BaseEvent {
  type: 'skill_load'
  name: string
  source: string
}

export interface SkillInvokeEvent extends BaseEvent {
  type: 'skill_invoke'
  name: string
}

export interface StateChangeEvent extends BaseEvent {
  type: 'state_change'
  field: string
  oldValue: unknown
  newValue: unknown
}

export interface ContextCompactEvent extends BaseEvent {
  type: 'context_compact'
}

export interface HookFireEvent extends BaseEvent {
  type: 'hook_fire'
  hookName: string
}

export interface MessageEvent extends BaseEvent {
  type: 'message'
  role: string
  content: unknown
}

export interface TurnStartEvent extends BaseEvent {
  type: 'turn_start'
  turnNumber: number
}

export interface TurnEndEvent extends BaseEvent {
  type: 'turn_end'
  turnNumber: number
  duration?: number
  inputTokens?: number
  outputTokens?: number
  cost?: number
  stopReason?: string
}

export type ZszCodeEvent =
  | ApiStreamStartEvent
  | ApiStreamEvent
  | ApiStreamEndEvent
  | ToolCallStartEvent
  | ToolCallEndEvent
  | ToolPermissionRequestEvent
  | ToolPermissionResolvedEvent
  | AgentSpawnEvent
  | AgentCompleteEvent
  | McpConnectEvent
  | McpCallEvent
  | SkillLoadEvent
  | SkillInvokeEvent
  | StateChangeEvent
  | ContextCompactEvent
  | HookFireEvent
  | MessageEvent
  | TurnStartEvent
  | TurnEndEvent

/** Workflow tree node types */
export interface AgentNode {
  id: string
  parentId?: string
  agentType: string
  description: string
  status: 'running' | 'completed' | 'failed'
  startTime: number
  endTime?: number
  children: AgentNode[]
  toolCalls: ToolCallInfo[]
}

export interface ToolCallInfo {
  toolName: string
  toolUseId: string
  input: unknown
  success: boolean
  duration: number
  startTime: number
}

/** Message types for Chat */
export interface ChatMessage {
  type: 'thinking' | 'text' | 'tool_use' | 'tool_result' | 'result' | 'system'
  data: Record<string, unknown>
}
