import React from 'react'
import type { Session } from '../hooks/useSession'

export interface SessionSidebarProps {
  sessions: Session[]
  activeSessionId: string
  onSwitchSession: (id: string) => void
  onCreateSession: () => void
}

export const SessionSidebar: React.FC<SessionSidebarProps> = ({
  sessions,
  activeSessionId,
  onSwitchSession,
  onCreateSession,
}) => {
  return (
    <div
      data-testid="session-sidebar"
      className="w-64 flex-shrink-0 bg-bg-secondary/50 border-r border-border-subtle flex flex-col h-full backdrop-blur-sm"
    >
      {/* Header */}
      <div className="p-4 border-b border-border-subtle">
        <h2 className="text-xs font-semibold text-text-muted uppercase tracking-wider">
          Sessions
        </h2>
      </div>

      {/* Session list */}
      <div className="flex-1 overflow-y-auto p-2 space-y-1">
        {sessions.map((s) => (
          <button
            key={s.id}
            data-testid="session-item"
            onClick={() => {
              if (s.id !== activeSessionId) onSwitchSession(s.id)
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && s.id !== activeSessionId)
                onSwitchSession(s.id)
            }}
            className={`w-full text-left px-3 py-2.5 text-sm rounded-lg transition-all duration-200 ${
              s.id === activeSessionId
                ? 'bg-accent-blue/20 text-text-primary border border-accent-blue/30'
                : 'text-text-secondary hover:bg-bg-hover hover:text-text-primary border border-transparent'
            }`}
          >
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${
                s.id === activeSessionId ? 'bg-accent-blue' : 'bg-text-muted'
              }`} />
              <span className="truncate">{s.name}</span>
            </div>
          </button>
        ))}
      </div>

      {/* New session button */}
      <div className="p-3 border-t border-border-subtle">
        <button
          data-testid="new-session-button"
          onClick={onCreateSession}
          className="w-full px-4 py-2.5 text-sm font-medium bg-bg-hover hover:bg-bg-card
                     text-text-secondary hover:text-text-primary
                     rounded-lg border border-border-subtle hover:border-border-medium
                     transition-all duration-300"
        >
          + New Session
        </button>
      </div>
    </div>
  )
}

export default SessionSidebar
