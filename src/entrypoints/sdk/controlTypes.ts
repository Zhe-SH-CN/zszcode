/**
 * SDK control type definitions for bridge/REPL communication.
 *
 * These are stub types extracted to break import cycles.
 */

// ============================================================================
// Control request (server -> REPL)
// ============================================================================

export interface SDKControlPermissionRequest {
  tool_name: string
  tool_use_id: string
  input: Record<string, unknown>
  description?: string
  [key: string]: unknown
}

export type SDKControlRequest = {
  type: 'control_request'
  request_id: string
  request:
    | { subtype: 'initialize'; [key: string]: unknown }
    | { subtype: 'set_model'; model: string; [key: string]: unknown }
    | {
        subtype: 'set_max_thinking_tokens'
        max_thinking_tokens: number
        [key: string]: unknown
      }
    | {
        subtype: 'set_permission_mode'
        mode: string
        [key: string]: unknown
      }
    | {
        subtype: 'permission'
        permission_request: SDKControlPermissionRequest
        [key: string]: unknown
      }
    | { subtype: 'cancel_permission'; [key: string]: unknown }
    | { subtype: 'mcp_set_servers'; [key: string]: unknown }
    | { subtype: 'reload_plugins'; [key: string]: unknown }
    | { subtype: string; [key: string]: unknown }
}

// ============================================================================
// Control response (REPL -> server)
// ============================================================================

export type SDKControlResponse = {
  type: 'control_response'
  response:
    | {
        subtype: 'success'
        request_id: string
        response: Record<string, unknown>
      }
    | {
        subtype: 'error'
        request_id: string
        error: string
      }
    | {
        subtype: 'permission_grant'
        request_id: string
        [key: string]: unknown
      }
    | {
        subtype: 'permission_deny'
        request_id: string
        [key: string]: unknown
      }
    | {
        subtype: string
        request_id: string
        [key: string]: unknown
      }
}

// ============================================================================
// MCP set servers response
// ============================================================================

export type SDKControlMcpSetServersResponse = {
  added: string[]
  removed: string[]
  errors: Record<string, string>
}

// ============================================================================
// Reload plugins response
// ============================================================================

export type SDKControlReloadPluginsResponse = {
  commands: unknown[]
  agents: unknown[]
  plugins: Array<{
    name: string
    path: string
    source?: string
  }>
  mcpServers: unknown[]
  error_count: number
}

// ============================================================================
// Stdout message (REPL -> CLI transport)
// ============================================================================

export type StdoutMessage = {
  type: 'system' | 'assistant' | 'user' | 'result' | 'stream_event' | string
  [key: string]: unknown
}
