import React, { useState } from 'react'

export interface ThinkingBlockProps {
  content: string
}

export const ThinkingBlock: React.FC<ThinkingBlockProps> = ({ content }) => {
  const [expanded, setExpanded] = useState(false)
  const preview = content.length > 100 ? content.slice(0, 100) + '...' : content

  return (
    <div
      data-testid={expanded ? 'thinking-block-expanded' : 'thinking-block'}
      className="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden"
    >
      <button
        onClick={() => setExpanded((v) => !v)}
        className="w-full text-left px-3 py-2 text-sm text-gray-400 hover:text-gray-200 transition-colors"
      >
        {expanded ? 'Thinking (click to collapse)' : 'Thinking...'}
      </button>

      <div
        className="px-3 pb-3 text-sm text-gray-300 font-mono overflow-hidden transition-[max-height] duration-300"
        style={{ maxHeight: expanded ? '2000px' : '0px' }}
      >
        {expanded ? content : preview}
      </div>
    </div>
  )
}

export default ThinkingBlock
