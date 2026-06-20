import React from 'react'
import type { ToolCallInfo } from '../types/events'

export interface ToolCallNodeProps {
  toolCall: ToolCallInfo
}

export const ToolCallNode: React.FC<ToolCallNodeProps> = ({ toolCall }) => {
  const formatDuration = (ms: number) => {
    if (ms >= 1000) return `${(ms / 1000).toFixed(1)}s`
    return `${ms}ms`
  }

  return (
    <div
      data-testid="tool-call-node"
      className="bg-gray-800/50 border border-gray-700/50 rounded px-3 py-1.5 mb-1 flex items-center gap-2 text-sm"
    >
      <span className="font-bold text-gray-200 text-xs">
        {toolCall.toolName}
      </span>
      <span className="text-gray-500 text-xs">
        {formatDuration(toolCall.duration)}
      </span>
      <span className="text-xs">
        {toolCall.success ? '✅' : '❌'}
      </span>
    </div>
  )
}

export default ToolCallNode
