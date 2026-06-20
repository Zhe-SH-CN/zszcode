import { EventEmitter } from 'events'

// 19 event variants
export type ZszCodeEvent =
  | { type: 'api_stream_start'; timestamp: number; model: string }
  | { type: 'api_stream_event'; timestamp: number; data: unknown }
  | { type: 'api_stream_end'; timestamp: number; duration: number; tokens: number }
  | { type: 'tool_call_start'; timestamp: number; toolName: string; toolUseId: string; input: unknown; agentId?: string }
  | { type: 'tool_call_end'; timestamp: number; toolName: string; toolUseId: string; success: boolean; duration: number; output?: unknown }
  | { type: 'tool_permission_request'; timestamp: number; toolName: string; toolUseId: string; input: unknown }
  | { type: 'tool_permission_resolved'; timestamp: number; toolUseId: string; decision: string; source: string }
  | { type: 'agent_spawn'; timestamp: number; parentId: string; childId: string; agentType: string; description: string }
  | { type: 'agent_complete'; timestamp: number; agentId: string; duration: number }
  | { type: 'mcp_connect'; timestamp: number; serverName: string; success: boolean }
  | { type: 'mcp_call'; timestamp: number; serverName: string; toolName: string; request: unknown; response?: unknown; duration?: number }
  | { type: 'skill_load'; timestamp: number; name: string; source: string }
  | { type: 'skill_invoke'; timestamp: number; name: string }
  | { type: 'state_change'; timestamp: number; field: string; oldValue: unknown; newValue: unknown }
  | { type: 'context_compact'; timestamp: number }
  | { type: 'hook_fire'; timestamp: number; hookName: string }
  | { type: 'message'; timestamp: number; role: string; content: unknown }
  | { type: 'turn_start'; timestamp: number; turnNumber: number }
  | { type: 'turn_end'; timestamp: number; turnNumber: number }

const MAX_HISTORY = 1000

export class ZszCodeEventBus extends EventEmitter {
  private history: ZszCodeEvent[] = []
  private messageQueue: string[] = []

  // Web UI sends messages here; agent loop picks them up
  enqueueMessage(content: string): void {
    this.messageQueue.push(content)
  }

  // Called by agent loop to get next message from Web UI
  dequeueMessage(): string | undefined {
    return this.messageQueue.shift()
  }

  emit(event: ZszCodeEvent): boolean {
    this.history.push(event)
    if (this.history.length > MAX_HISTORY) {
      this.history.shift()
    }
    const listeners = this.listeners('event')
    if (listeners.length === 0) return false
    for (const listener of listeners) {
      try {
        listener(event)
      } catch {
        // listener errors are swallowed — other listeners still execute
      }
    }
    return true
  }

  onEvent(listener: (event: ZszCodeEvent) => void): () => void {
    this.on('event', listener)
    return () => {
      this.removeListener('event', listener)
    }
  }

  getHistory(limit = 100): ZszCodeEvent[] {
    return this.history.slice(-limit)
  }
}

export const eventBus = new ZszCodeEventBus()
