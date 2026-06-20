import React, { useState } from 'react'

export interface ToolUseBlockProps {
  toolName: string
  toolUseId: string
  input: unknown
}

export const ToolUseBlock: React.FC<ToolUseBlockProps> = ({
  toolName,
  input,
}) => {
  const [showInput, setShowInput] = useState(false)

  return (
    <div
      data-testid="tool-use-block"
      className="glass-card border-l-4 border-accent-blue overflow-hidden"
    >
      <div className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-accent-blue/20 flex items-center justify-center">
              <svg className="w-4 h-4 text-accent-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
              </svg>
            </div>
            <span className="font-semibold text-text-primary">{toolName}</span>
          </div>
          <button
            data-testid="toggle-tool-input"
            onClick={() => setShowInput((v) => !v)}
            className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium
                       text-text-secondary hover:text-text-primary
                       bg-bg-hover rounded-lg transition-all duration-200"
          >
            {showInput ? (
              <>
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                </svg>
                Hide
              </>
            ) : (
              <>
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
                Show input
              </>
            )}
          </button>
        </div>
      </div>

      {showInput && (
        <div className="border-t border-border-subtle bg-bg-secondary/50 p-4">
          <pre
            data-testid="tool-input-json"
            className="text-xs text-text-secondary font-mono bg-bg-primary rounded-lg p-3 max-h-[300px] overflow-y-auto"
          >
            {typeof input === 'string' ? input : JSON.stringify(input, null, 2)}
          </pre>
        </div>
      )}
    </div>
  )
}

export default ToolUseBlock
