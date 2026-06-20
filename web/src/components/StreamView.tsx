import React, { useEffect, useRef } from 'react'
import MessageBlock from './MessageBlock'
import type { ChatMessage } from '../types/events'

export interface StreamViewProps {
  messages: ChatMessage[]
}

export const StreamView: React.FC<StreamViewProps> = ({ messages }) => {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = containerRef.current
    if (el) {
      el.scrollTop = el.scrollHeight
    }
  }, [messages.length])

  return (
    <div
      ref={containerRef}
      data-testid="stream-view"
      className="flex-1 overflow-y-auto p-6 space-y-4"
    >
      {messages.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-full text-center">
          <div className="w-16 h-16 mb-4 rounded-full bg-bg-card flex items-center justify-center border border-border-subtle">
            <svg className="w-8 h-8 text-text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
          </div>
          <p className="text-text-muted text-sm">No messages yet</p>
          <p className="text-text-muted/50 text-xs mt-1">Send a message to start the conversation</p>
        </div>
      ) : (
        <div className="space-y-4">
          {messages.map((msg, i) => (
            <div key={i} className="animate-fade-in" style={{ animationDelay: `${i * 50}ms` }}>
              <MessageBlock message={msg} />
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default StreamView
