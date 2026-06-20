import React, { useState } from 'react'

export interface ToolResultBlockProps {
  content: string
  success: boolean
}

const MAX_LINES = 10

export const ToolResultBlock: React.FC<ToolResultBlockProps> = ({
  content,
  success,
}) => {
  const [expanded, setExpanded] = useState(!success) // failed = expanded by default
  const lines = content.split('\n')
  const needsTruncation = lines.length > MAX_LINES
  const previewLines = lines.slice(0, MAX_LINES).join('\n')
  const remaining = lines.length - MAX_LINES

  const borderColor = success ? 'border-green-500' : 'border-red-500'
  const bgColor = success ? 'bg-green-900/10' : 'bg-red-900/10'
  const icon = success ? (
    <span className="text-green-400">&#10003;</span>
  ) : (
    <span className="text-red-400">&#10007;</span>
  )
  const label = success ? 'Success' : 'Failed'

  return (
    <div
      data-testid={`tool-result-block${success ? '-success' : '-failed'}`}
      className={`bg-gray-800 rounded-lg border-l-4 ${borderColor} ${bgColor} overflow-hidden`}
    >
      <div className="px-3 py-2 flex items-center gap-2">
        {icon}
        <span
          className={`text-sm font-semibold ${success ? 'text-green-400' : 'text-red-400'}`}
        >
          {label}
        </span>
        {needsTruncation && (
          <button
            data-testid="show-more-button"
            onClick={() => setExpanded((v) => !v)}
            className="ml-auto text-xs text-gray-400 hover:text-gray-200"
          >
            {expanded ? 'Show less' : 'Show more'}
          </button>
        )}
      </div>

      <div
        className="px-3 pb-3 text-xs text-gray-300 font-mono overflow-hidden transition-[max-height] duration-300"
        style={{ maxHeight: expanded ? '500px' : '200px' }}
      >
        <pre className="whitespace-pre-wrap">
          {expanded || !needsTruncation
            ? content
            : `${previewLines}\n... (${remaining} more lines)`}
        </pre>
      </div>
    </div>
  )
}

export default ToolResultBlock
