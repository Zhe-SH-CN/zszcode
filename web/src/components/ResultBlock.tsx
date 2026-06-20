import React from 'react'

export interface ResultBlockProps {
  duration: number
  inputTokens: number
  outputTokens: number
  cost: number
  stopReason: string
}

export const ResultBlock: React.FC<ResultBlockProps> = ({
  duration,
  inputTokens,
  outputTokens,
  cost,
  stopReason,
}) => {
  const formatDuration = (ms: number) => {
    if (ms >= 1000) return `${(ms / 1000).toFixed(1)}s`
    return `${ms}ms`
  }

  const formatTokens = (n: number) => {
    if (n >= 1000) return `${(n / 1000).toFixed(1)}k`
    return String(n)
  }

  return (
    <div
      data-testid="result-block"
      className="bg-gray-800 rounded-lg border border-gray-700 px-4 py-2 flex items-center gap-3 text-sm text-gray-300"
    >
      <span>{formatDuration(duration)}</span>
      <span className="text-gray-600">|</span>
      <span>
        {formatTokens(inputTokens)} in / {formatTokens(outputTokens)} out
      </span>
      <span className="text-gray-600">|</span>
      <span>${cost.toFixed(2)}</span>
      <span className="text-gray-600">|</span>
      <span className="text-gray-400">{stopReason}</span>
    </div>
  )
}

export default ResultBlock
