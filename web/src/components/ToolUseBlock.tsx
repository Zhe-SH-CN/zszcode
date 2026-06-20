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
      className="bg-gray-800 rounded-lg border-l-4 border-blue-500 p-3"
    >
      <div className="flex items-center justify-between">
        <span className="font-bold text-blue-400 text-sm">{toolName}</span>
        <button
          data-testid="toggle-tool-input"
          onClick={() => setShowInput((v) => !v)}
          className="text-xs text-gray-400 hover:text-gray-200"
        >
          {showInput ? 'Hide input ▼' : 'Show input ▶'}
        </button>
      </div>

      {showInput && (
        <pre
          data-testid="tool-input-json"
          className="mt-2 text-xs text-gray-300 font-mono bg-gray-900 rounded p-2 max-h-[300px] overflow-y-auto"
        >
          {typeof input === 'string' ? input : JSON.stringify(input, null, 2)}
        </pre>
      )}
    </div>
  )
}

export default ToolUseBlock
