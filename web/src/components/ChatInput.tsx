import React, { useState, useRef, useEffect } from 'react'

export interface ChatInputProps {
  onSend: (content: string) => void
  disabled?: boolean
}

export const ChatInput: React.FC<ChatInputProps> = ({
  onSend,
  disabled = false,
}) => {
  const [text, setText] = useState('')
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  // auto-resize textarea
  useEffect(() => {
    const el = textareaRef.current
    if (el) {
      el.style.height = 'auto'
      el.style.height = `${Math.min(el.scrollHeight, 240)}px`
    }
  }, [text])

  const handleSend = () => {
    const trimmed = text.trim()
    if (!trimmed || disabled) return
    onSend(trimmed)
    setText('')
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <div
      data-testid="chat-input-container"
      className="border-t border-border-subtle bg-bg-secondary/60 backdrop-blur-sm p-4"
    >
      {disabled ? (
        <div className="flex items-center gap-3 px-4 py-3">
          <div className="w-2 h-2 rounded-full bg-accent-amber animate-pulse" />
          <span className="text-text-secondary text-sm">Thinking...</span>
        </div>
      ) : (
        <div className="flex items-end gap-3">
          <div className="flex-1 relative">
            <textarea
              ref={textareaRef}
              data-testid="chat-input"
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type a message..."
              rows={1}
              className="w-full px-4 py-3 bg-bg-card text-text-primary
                         border border-border-subtle rounded-xl
                         resize-none focus:outline-none
                         focus:border-accent-purple focus:ring-2 focus:ring-accent-purple/20
                         placeholder:text-text-muted
                         transition-all duration-300"
            />
            <div className="absolute right-3 bottom-3 text-xs text-text-muted font-mono">
              {text.length > 0 && <span>{text.length}</span>}
            </div>
          </div>
          <button
            data-testid="send-button"
            onClick={handleSend}
            disabled={disabled || !text.trim()}
            className="px-6 py-3 text-white font-medium rounded-xl
                       transition-all duration-300
                       hover:shadow-glow hover:scale-[1.02]
                       active:scale-[0.98]
                       disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            style={{ background: 'var(--accent-gradient)' }}
          >
            Send
          </button>
        </div>
      )}
    </div>
  )
}

export default ChatInput
