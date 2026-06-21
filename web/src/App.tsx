import React, { useState } from 'react'
import ContextGauge from './components/ContextGauge'
import SessionSidebar from './components/SessionSidebar'
import PermissionBar from './components/PermissionBar'
import StreamView from './components/StreamView'
import WorkflowView from './components/WorkflowView'
import SignalsView from './components/SignalsView'
import ChatInput from './components/ChatInput'
import { useWebSocket } from './hooks/useWebSocket'
import { useSession } from './hooks/useSession'
import type { ChatMessage, AgentNode, ToolCallInfo, ZszCodeEvent } from './types/events'

// Default model from config
const DEFAULT_MODEL = 'mimo-v2.5-pro'

type Tab = 'chat' | 'workflow' | 'signals'

/** Build a simple agent tree from events for the workflow view */
function buildTreeFromEvents(events: ZszCodeEvent[]): AgentNode | null {
  const nodeMap = new Map<string, AgentNode>()
  let root: AgentNode | null = null

  for (const ev of events) {
    if (ev.type === 'agent_spawn') {
      const node: AgentNode = {
        id: ev.childId,
        parentId: ev.parentId || undefined,
        agentType: ev.agentType,
        description: ev.description,
        status: 'running',
        startTime: ev.timestamp,
        children: [],
        toolCalls: [],
      }
      nodeMap.set(ev.childId, node)

      const parent = ev.parentId ? nodeMap.get(ev.parentId) : null
      if (parent) {
        parent.children.push(node)
      } else if (!root) {
        root = node
      }
    } else if (ev.type === 'agent_complete') {
      const node = nodeMap.get(ev.agentId)
      if (node) {
        node.status = ev.success === false ? 'failed' : 'completed'
        node.endTime = ev.timestamp
      }
    } else if (ev.type === 'tool_call_start') {
      const tc: ToolCallInfo = {
        toolName: ev.toolName,
        toolUseId: ev.toolUseId,
        input: ev.input,
        success: false,
        duration: 0,
        startTime: ev.timestamp,
      }
      const agent = ev.agentId ? nodeMap.get(ev.agentId) : root
      if (agent) agent.toolCalls.push(tc)
    } else if (ev.type === 'tool_call_end') {
      // find the tool call across all nodes
      for (const node of nodeMap.values()) {
        const tc = node.toolCalls.find((t) => t.toolUseId === ev.toolUseId)
        if (tc) {
          tc.success = ev.success
          tc.duration = ev.duration
          break
        }
      }
    }
  }

  return root
}

/** Convert raw events to chat messages */
function eventsToMessages(events: ZszCodeEvent[]): ChatMessage[] {
  const messages: ChatMessage[] = []
  for (const ev of events) {
    switch (ev.type) {
      case 'message':
        messages.push({
          type: ev.role === 'assistant' ? 'text' : 'system',
          data: { content: ev.content, level: 'info' },
        })
        break
      case 'tool_call_start':
        messages.push({
          type: 'tool_use',
          data: { toolName: ev.toolName, toolUseId: ev.toolUseId, input: ev.input },
        })
        break
      case 'tool_call_end':
        messages.push({
          type: 'tool_result',
          data: {
            content: typeof ev.output === 'string' ? ev.output : JSON.stringify(ev.output ?? ''),
            success: ev.success,
          },
        })
        break
      case 'turn_end':
        messages.push({
          type: 'result',
          data: {
            duration: 0,
            inputTokens: 0,
            outputTokens: 0,
            cost: 0,
            stopReason: 'end_turn',
          },
        })
        break
    }
  }
  return messages
}

/** Get WebSocket URL from current location */
function getWsUrl(): string {
  const proto = window.location.protocol === 'https:' ? 'wss:' : 'ws:'
  const params = new URLSearchParams(window.location.search)
  const token = params.get('token') || ''
  return `${proto}//${window.location.host}/ws?token=${encodeURIComponent(token)}`
}

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>('chat')
  const [permissionRequest, setPermissionRequest] = useState<{
    toolName: string
    toolUseId: string
    input: unknown
  } | null>(null)

  const wsUrl = getWsUrl()
  const { events, connected, sendMessage, unauthorized } = useWebSocket(wsUrl)
  const { sessions, activeSessionId, switchSession, createSession } = useSession()

  // Watch for permission request events
  React.useEffect(() => {
    const last = events[events.length - 1]
    if (last?.type === 'tool_permission_request') {
      setPermissionRequest({
        toolName: last.toolName,
        toolUseId: last.toolUseId,
        input: last.input,
      })
    }
  }, [events])

  // 401 error page
  if (unauthorized) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-900">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-400 mb-2">Unauthorized</h1>
          <p className="text-gray-400 mb-4">Invalid or missing token</p>
          <button
            data-testid="retry-button"
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    )
  }

  const messages = eventsToMessages(events)
  const rootNode = buildTreeFromEvents(events)

  const handleSend = (content: string) => {
    sendMessage({ type: 'send', sessionId: activeSessionId, content })
  }

  return (
    <div data-testid="app" className="h-screen flex flex-col bg-bg-primary text-text-primary">
      {/* Top bar */}
      <ContextGauge
        tokenCount={0}
        maxTokens={200000}
        cost={0}
        model={DEFAULT_MODEL}
        agentStatus={connected ? 'idle' : 'idle'}
      />

      {/* Main area */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <SessionSidebar
          sessions={sessions}
          activeSessionId={activeSessionId}
          onSwitchSession={switchSession}
          onCreateSession={() => createSession()}
        />

        {/* Content area */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Tabs */}
          <div className="flex border-b border-border-subtle bg-bg-secondary/50 backdrop-blur-sm">
            {(['chat', 'workflow', 'signals'] as Tab[]).map((tab) => (
              <button
                key={tab}
                data-testid={`tab-${tab}`}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-3 text-sm font-medium capitalize transition-all duration-300 ${
                  activeTab === tab
                    ? 'text-text-primary border-b-2 border-accent-blue bg-bg-card/50'
                    : 'text-text-secondary hover:text-text-primary hover:bg-bg-hover/50'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Tab content */}
          {activeTab === 'chat' && (
            <div data-testid="tab-content-chat" className="flex-1 flex flex-col overflow-hidden">
              <StreamView messages={messages} />
              <ChatInput onSend={handleSend} disabled={false} />
            </div>
          )}

          {activeTab === 'workflow' && (
            <div data-testid="tab-content-workflow" className="flex-1 overflow-hidden">
              <WorkflowView rootNode={rootNode} />
            </div>
          )}

          {activeTab === 'signals' && (
            <div data-testid="tab-content-signals" className="flex-1 overflow-hidden">
              <SignalsView events={events} />
            </div>
          )}
        </div>
      </div>

      {/* Permission bar (conditional) */}
      {permissionRequest && (
        <PermissionBar
          toolName={permissionRequest.toolName}
          toolUseId={permissionRequest.toolUseId}
          input={permissionRequest.input}
          sendMessage={sendMessage}
          onAllow={() => setPermissionRequest(null)}
          onDeny={() => setPermissionRequest(null)}
          onAllowAlways={() => setPermissionRequest(null)}
        />
      )}
    </div>
  )
}

export default App
