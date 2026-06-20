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

  const borderClass = success ? 'border-accent-emerald' : 'border-accent-rose'
  const bgClass = success ? 'bg-accent-emerald/5' : 'bg-accent-rose/5'
  const textClass = success ? 'text-accent-emerald' : 'text-accent-rose'
  const icon = success ? (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
    </svg>
  ) : (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    </svg>
  )
  const label = success ? 'Success' : 'Failed'

  return (
    <div
      data-testid={`tool-result-block${success ? '-success' : '-failed'}`}
      className={`glass-card border-l-4 ${borderClass} ${bgClass} overflow-hidden`}
    >
      <div className="px-4 py-3 flex items-center gap-3">
        <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
          success ? 'bg-accent-emerald/20' : 'bg-accent-rose/20'
        }`}>
          <div className={textClass}>{icon}</div>
        </div>
        <span className={`text-sm font-semibold ${textClass}`}>{label}</span>
        {needsTruncation && (
          <button
            data-testid="show-more-button"
            onClick={() => setExpanded((v) => !v)}
            className="ml-auto flex items-center gap-1 px-3 py-1.5 text-xs font-medium
                       text-text-secondary hover:text-text-primary
                       bg-bg-hover rounded-lg transition-all duration-200"
          >
            {expanded ? (
              <>
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                </svg>
                Show less
              </>
            ) : (
              <>
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
                Show more ({remaining} lines)
              </>
            )}
          </button>
        )}
      </div>

      <div
        className="px-4 pb-4 text-xs text-text-secondary font-mono overflow-hidden transition-[max-height] duration-300"
        style={{ maxHeight: expanded ? '500px' : '200px' }}
      >
        <pre className="whitespace-pre-wrap bg-bg-primary rounded-lg p-3">
          {expanded || !needsTruncation
            ? content
            : `${previewLines}\n... (${remaining} more lines)`}
        </pre>
      </div>
    </div>
  )
}

export default ToolResultBlock
