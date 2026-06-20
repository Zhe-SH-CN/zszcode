import React from 'react'

export interface ContextGaugeProps {
  tokenCount: number
  maxTokens: number
  cost: number
  model: string
  agentStatus: 'idle' | 'thinking' | 'tool_calling'
}

export const ContextGauge: React.FC<ContextGaugeProps> = ({
  tokenCount,
  maxTokens,
  cost,
  model,
  agentStatus,
}) => {
  const pct = maxTokens > 0 ? (tokenCount / maxTokens) * 100 : 0
  const barColor = pct >= 80 ? 'bg-red-500' : 'bg-blue-500'

  const statusColor =
    agentStatus === 'thinking'
      ? 'text-yellow-400'
      : agentStatus === 'tool_calling'
        ? 'text-green-400'
        : 'text-gray-400'

  return (
    <div
      data-testid="context-gauge"
      className="h-10 flex items-center gap-4 px-4 bg-gray-800 border-b border-gray-700 text-sm"
    >
      {/* Token bar */}
      <div className="flex items-center gap-2 min-w-[200px]">
        <span className="text-gray-300 whitespace-nowrap">
          {tokenCount.toLocaleString()} / {maxTokens.toLocaleString()} tokens
        </span>
        <div className="flex-1 h-2 bg-gray-600 rounded-full overflow-hidden">
          <div
            className={`h-full ${barColor} rounded-full transition-all`}
            style={{ width: `${Math.min(pct, 100)}%` }}
          />
        </div>
      </div>

      {/* Cost */}
      <span className="text-gray-300 whitespace-nowrap">
        ${cost.toFixed(2)}
      </span>

      {/* Model */}
      <span className="text-gray-300 whitespace-nowrap">{model}</span>

      {/* Agent status */}
      <span className={`${statusColor} whitespace-nowrap`} data-testid="agent-status">
        {agentStatus}
      </span>
    </div>
  )
}

export default ContextGauge
