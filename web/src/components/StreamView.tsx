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
      className="flex-1 overflow-y-auto p-4 space-y-2"
    >
      {messages.length === 0 ? (
        <p className="text-gray-500 text-sm text-center mt-8">No messages yet</p>
      ) : (
        messages.map((msg, i) => <MessageBlock key={i} message={msg} />)
      )}
    </div>
  )
}

export default StreamView
