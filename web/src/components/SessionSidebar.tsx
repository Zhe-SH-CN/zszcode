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
      className="w-60 flex-shrink-0 bg-gray-900 border-r border-gray-700 flex flex-col h-full"
    >
      <div className="p-3 border-b border-gray-700">
        <h2 className="text-sm font-semibold text-gray-300 uppercase tracking-wider">
          Sessions
        </h2>
      </div>

      <div className="flex-1 overflow-y-auto">
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
            className={`w-full text-left px-3 py-2 text-sm transition-colors ${
              s.id === activeSessionId
                ? 'bg-gray-700 text-white'
                : 'text-gray-400 hover:bg-gray-800 hover:text-gray-200'
            }`}
          >
            {s.name}
          </button>
        ))}
      </div>

      <button
        data-testid="new-session-button"
        onClick={onCreateSession}
        className="m-2 px-3 py-1.5 text-sm bg-gray-700 hover:bg-gray-600 text-gray-200 rounded transition-colors"
      >
        New Session
      </button>
    </div>
  )
}

export default SessionSidebar
