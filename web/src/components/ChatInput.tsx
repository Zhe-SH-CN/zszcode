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
      el.style.height = `${Math.min(el.scrollHeight, 240)}px` // ~10 lines
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
      className="border-t border-gray-700 bg-gray-800 p-3 flex items-end gap-2"
    >
      {disabled ? (
        <div className="flex-1 text-sm text-gray-400 py-2">Thinking...</div>
      ) : (
        <textarea
          ref={textareaRef}
          data-testid="chat-input"
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type a message..."
          rows={1}
          className="flex-1 bg-gray-900 text-gray-100 border border-gray-600 rounded-lg px-3 py-2 text-sm resize-none focus:outline-none focus:border-blue-500 font-sans"
        />
      )}
      <button
        data-testid="send-button"
        onClick={handleSend}
        disabled={disabled || !text.trim()}
        className="px-4 py-2 text-sm bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded-lg transition-colors"
      >
        Send
      </button>
    </div>
  )
}

export default ChatInput
