/**
 * Message type definitions for the REPL conversation system.
 *
 * These are stub types extracted to break import cycles.
 * The full implementation lives in the original codebase.
 */

import type {
  BetaContentBlock,
  BetaContentBlockParam,
  BetaMessage,
  BetaToolUseBlock,
  BetaToolResultBlockParam,
  BetaTextBlockParam,
} from '@anthropic-ai/sdk/resources/beta/messages/messages.mjs'

// Aliases for convenience
type ContentBlockParam = BetaContentBlockParam
type ToolUseBlock = BetaToolUseBlock
type ToolResultBlockParam = BetaToolResultBlockParam
type TextBlockParam = BetaTextBlockParam

// ============================================================================
// Helper types
// ============================================================================

export type MessageOrigin = {
  kind: string
  [key: string]: unknown
}

export type PartialCompactDirection = 'from' | 'to'

export type SystemMessageLevel = 'info' | 'warning' | 'error'

export type StopHookInfo = {
  hookName: string
  durationMs: number
  outcome: string
  [key: string]: unknown
}

// ============================================================================
// Base message fields
// ============================================================================

interface BaseMessage {
  uuid: string
  timestamp: string
}

// ============================================================================
// User message
// ============================================================================

export interface UserMessage extends BaseMessage {
  type: 'user'
  message: {
    role: 'user'
    content: string | ContentBlockParam[]
  }
  isMeta?: boolean
  isVisibleInTranscriptOnly?: boolean
  isVirtual?: true
  isCompactSummary?: true
  summarizeMetadata?: unknown
  toolUseResult?: string
  mcpMeta?: unknown
  imagePasteIds?: string[]
  sourceToolAssistantUUID?: string
  permissionMode?: string
  origin?: MessageOrigin
}

// ============================================================================
// Assistant message
// ============================================================================

export interface AssistantMessage extends BaseMessage {
  type: 'assistant'
  message: BetaMessage & {
    content: BetaContentBlock[]
    role: 'assistant'
  }
  requestId?: string
  apiError?: unknown
  error?: unknown
  errorDetails?: string
  isApiErrorMessage?: boolean
  isVirtual?: true
  costUSD?: number
  durationMs?: number
  sender?: string
}

// ============================================================================
// Progress message
// ============================================================================

export interface ProgressMessage<P = unknown> extends BaseMessage {
  type: 'progress'
  data: P
  toolUseID: string
  parentToolUseID: string
}

// ============================================================================
// Attachment message
// ============================================================================

export interface AttachmentMessage extends BaseMessage {
  type: 'attachment'
  message: {
    role: 'user'
    content: ContentBlockParam[]
  }
  attachment: {
    type: string
    data?: unknown
    prompt?: string
    source_uuid?: string
    turnCount?: number
    maxTurns?: number
    [key: string]: unknown
  }
  isMeta?: boolean
  origin?: MessageOrigin
  source_uuid?: string
}

// ============================================================================
// System messages
// ============================================================================

export interface SystemAPIErrorMessage extends BaseMessage {
  type: 'system'
  subtype: 'api_error'
  error: unknown
  message: {
    role: 'user'
    content: string | ContentBlockParam[]
  }
}

export interface SystemInformationalMessage extends BaseMessage {
  type: 'system'
  subtype: 'informational'
  message: {
    role: 'user'
    content: string | ContentBlockParam[]
  }
  level: SystemMessageLevel
}

export interface SystemLocalCommandMessage extends BaseMessage {
  type: 'system'
  subtype: 'local_command'
  content: string
  message: {
    role: 'user'
    content: string | ContentBlockParam[]
  }
}

export interface SystemCompactBoundaryMessage extends BaseMessage {
  type: 'system'
  subtype: 'compact_boundary'
  content: string
  isMeta?: boolean
  level?: SystemMessageLevel
  logicalParentUuid?: string
  compactMetadata: {
    trigger?: string
    preTokens?: number
    userContext?: string
    messagesSummarized?: number
    preservedSegment?: {
      headUuid?: string
      anchorUuid?: string
      tailUuid?: string
    }
    preCompactDiscoveredTools?: unknown[]
    [key: string]: unknown
  }
  message: {
    role: 'user'
    content: string | ContentBlockParam[]
  }
}

export interface SystemMicrocompactBoundaryMessage extends BaseMessage {
  type: 'system'
  subtype: 'microcompact_boundary'
  message: {
    role: 'user'
    content: string | ContentBlockParam[]
  }
}

export interface SystemPermissionRetryMessage extends BaseMessage {
  type: 'system'
  subtype: 'permission_retry'
  message: {
    role: 'user'
    content: string | ContentBlockParam[]
  }
}

export interface SystemScheduledTaskFireMessage extends BaseMessage {
  type: 'system'
  subtype: 'scheduled_task_fire'
  message: {
    role: 'user'
    content: string | ContentBlockParam[]
  }
}

export interface SystemStopHookSummaryMessage extends BaseMessage {
  type: 'system'
  subtype: 'stop_hook_summary'
  message: {
    role: 'user'
    content: string | ContentBlockParam[]
  }
}

export interface SystemTurnDurationMessage extends BaseMessage {
  type: 'system'
  subtype: 'turn_duration'
  message: {
    role: 'user'
    content: string | ContentBlockParam[]
  }
}

export interface SystemBridgeStatusMessage extends BaseMessage {
  type: 'system'
  subtype: 'bridge_status'
  message: {
    role: 'user'
    content: string | ContentBlockParam[]
  }
}

export interface SystemMemorySavedMessage extends BaseMessage {
  type: 'system'
  subtype: 'memory_saved'
  message: {
    role: 'user'
    content: string | ContentBlockParam[]
  }
}

export interface SystemAgentsKilledMessage extends BaseMessage {
  type: 'system'
  subtype: 'agents_killed'
  message: {
    role: 'user'
    content: string | ContentBlockParam[]
  }
}

export interface SystemApiMetricsMessage extends BaseMessage {
  type: 'system'
  subtype: 'api_metrics'
  message: {
    role: 'user'
    content: string | ContentBlockParam[]
  }
}

export interface SystemAwaySummaryMessage extends BaseMessage {
  type: 'system'
  subtype: 'away_summary'
  message: {
    role: 'user'
    content: string | ContentBlockParam[]
  }
}

/**
 * Union of all system message subtypes.
 */
export type SystemMessage =
  | SystemAPIErrorMessage
  | SystemInformationalMessage
  | SystemLocalCommandMessage
  | SystemCompactBoundaryMessage
  | SystemMicrocompactBoundaryMessage
  | SystemPermissionRetryMessage
  | SystemScheduledTaskFireMessage
  | SystemStopHookSummaryMessage
  | SystemTurnDurationMessage
  | SystemBridgeStatusMessage
  | SystemMemorySavedMessage
  | SystemAgentsKilledMessage
  | SystemApiMetricsMessage
  | SystemAwaySummaryMessage

// ============================================================================
// Stream event types
// ============================================================================

export type StreamEvent = {
  type:
    | 'message_start'
    | 'content_block_start'
    | 'content_block_delta'
    | 'content_block_stop'
    | 'message_delta'
    | 'message_stop'
    | 'ping'
    | 'stream_event'
  event?: {
    type: string
    message?: {
      usage?: unknown
      [key: string]: unknown
    }
    usage?: unknown
    [key: string]: unknown
  }
  [key: string]: unknown
}

export type RequestStartEvent = {
  type: 'request_start'
  requestId: string
  [key: string]: unknown
}

// ============================================================================
// Special message types
// ============================================================================

export type ToolUseSummaryMessage = BaseMessage & {
  type: 'tool_use_summary'
  message: {
    role: 'user'
    content: ContentBlockParam[]
  }
}

export type TombstoneMessage = BaseMessage & {
  type: 'tombstone'
  message: {
    role: 'user'
    content: ContentBlockParam[]
  }
}

export type QueueOperationMessage = BaseMessage & {
  type: 'queue_operation'
  message: {
    role: 'user'
    content: ContentBlockParam[]
  }
}

export type HookResultMessage = BaseMessage & {
  type: 'hook_result'
  message: {
    role: 'user'
    content: ContentBlockParam[]
  }
}

// ============================================================================
// Grouped / Collapsed message types (UI-level)
// ============================================================================

export type GroupedToolUseMessage = BaseMessage & {
  type: 'grouped_tool_use'
  toolName: string
  messages: NormalizedAssistantMessage[]
  results: UserMessage[]
  displayMessage: NormalizedAssistantMessage
  messageId?: string
}

export type CollapsedReadSearchGroup = BaseMessage & {
  type: 'collapsed_read_search'
  messages: NormalizedAssistantMessage[]
  results: UserMessage[]
  displayMessage: NormalizedAssistantMessage
  toolName: string
}

// ============================================================================
// Top-level message union
// ============================================================================

/**
 * Primary message union used throughout the REPL.
 */
export type Message =
  | UserMessage
  | AssistantMessage
  | ProgressMessage
  | AttachmentMessage
  | SystemMessage
  | ToolUseSummaryMessage
  | TombstoneMessage
  | QueueOperationMessage
  | HookResultMessage

// ============================================================================
// Normalized message types (after splitting multi-content messages)
// ============================================================================

export type NormalizedUserMessage = UserMessage & {
  type: 'user'
}

export type NormalizedAssistantMessage<
  T extends BetaContentBlock = BetaContentBlock,
> = AssistantMessage & {
  type: 'assistant'
  message: BetaMessage & {
    content: T[]
    role: 'assistant'
  }
}

export type NormalizedMessage =
  | NormalizedUserMessage
  | NormalizedAssistantMessage
  | ProgressMessage
  | AttachmentMessage
  | SystemMessage
  | ToolUseSummaryMessage
  | TombstoneMessage

// ============================================================================
// Renderable / Collapsible (UI-level union)
// ============================================================================

export type RenderableMessage =
  | NormalizedUserMessage
  | NormalizedAssistantMessage
  | ProgressMessage
  | AttachmentMessage
  | SystemMessage
  | GroupedToolUseMessage
  | CollapsedReadSearchGroup
  | ToolUseSummaryMessage
  | TombstoneMessage
  | QueueOperationMessage

export type CollapsibleMessage =
  | NormalizedAssistantMessage
  | GroupedToolUseMessage
