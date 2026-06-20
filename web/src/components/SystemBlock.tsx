import React from 'react'

export interface SystemBlockProps {
  content: string
  level?: 'info' | 'warning' | 'error'
}

export const SystemBlock: React.FC<SystemBlockProps> = ({
  content,
  level = 'info',
}) => {
  const borderColor =
    level === 'error'
      ? 'border-red-500'
      : level === 'warning'
        ? 'border-yellow-500'
        : 'border-blue-500'

  const icon =
    level === 'error' ? '❌' : level === 'warning' ? '⚠️' : 'ℹ️'

  return (
    <div
      data-testid="system-block"
      className={`bg-gray-800 rounded-lg border-l-4 ${borderColor} px-3 py-2 flex items-start gap-2 text-sm`}
    >
      <span>{icon}</span>
      <pre className="text-gray-300 font-mono whitespace-pre-wrap flex-1">
        {content}
      </pre>
    </div>
  )
}

export default SystemBlock
