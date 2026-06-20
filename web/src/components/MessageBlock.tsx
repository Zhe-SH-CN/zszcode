import React from 'react'
import ThinkingBlock from './ThinkingBlock'
import TextBlock from './TextBlock'
import ToolUseBlock from './ToolUseBlock'
import ToolResultBlock from './ToolResultBlock'
import ResultBlock from './ResultBlock'
import SystemBlock from './SystemBlock'
import type { ChatMessage } from '../types/events'

export interface MessageBlockProps {
  message: ChatMessage
}

export const MessageBlock: React.FC<MessageBlockProps> = ({ message }) => {
  const { type, data } = message

  switch (type) {
    case 'thinking':
      return <ThinkingBlock content={String(data.content ?? '')} />
    case 'text':
      return <TextBlock content={String(data.content ?? '')} />
    case 'tool_use':
      return (
        <ToolUseBlock
          toolName={String(data.toolName ?? '')}
          toolUseId={String(data.toolUseId ?? '')}
          input={data.input}
        />
      )
    case 'tool_result':
      return (
        <ToolResultBlock
          content={String(data.content ?? '')}
          success={data.success !== false}
        />
      )
    case 'result':
      return (
        <ResultBlock
          duration={Number(data.duration ?? 0)}
          inputTokens={Number(data.inputTokens ?? 0)}
          outputTokens={Number(data.outputTokens ?? 0)}
          cost={Number(data.cost ?? 0)}
          stopReason={String(data.stopReason ?? '')}
        />
      )
    case 'system':
      return (
        <SystemBlock
          content={String(data.content ?? '')}
          level={(data.level as 'info' | 'warning' | 'error') ?? 'info'}
        />
      )
    default:
      return (
        <pre
          data-testid="message-block-unknown"
          className="text-xs text-gray-500 bg-gray-800 rounded p-2 font-mono overflow-x-auto"
        >
          {JSON.stringify(message, null, 2)}
        </pre>
      )
  }
}

export default MessageBlock
