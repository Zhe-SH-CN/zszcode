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
  const barColor = pct >= 80
    ? 'bg-gradient-to-r from-accent-rose to-accent-amber'
    : 'bg-gradient-to-r from-accent-blue to-accent-purple'

  const statusConfig = {
    idle: { color: 'text-text-muted', dot: 'bg-text-muted', label: 'Idle' },
    thinking: { color: 'text-accent-amber', dot: 'bg-accent-amber', label: 'Thinking...' },
    tool_calling: { color: 'text-accent-emerald', dot: 'bg-accent-emerald', label: 'Running...' },
  }

  const status = statusConfig[agentStatus]

  return (
    <div
      data-testid="context-gauge"
      className="h-12 flex items-center gap-6 px-6 bg-bg-secondary/60 backdrop-blur-sm border-b border-border-subtle text-sm"
    >
      {/* Logo / Brand */}
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-accent-blue to-accent-purple flex items-center justify-center">
          <span className="text-white font-bold text-xs">Z</span>
        </div>
        <span className="text-text-primary font-semibold tracking-tight">zszcode</span>
      </div>

      {/* Token bar */}
      <div className="flex items-center gap-3 min-w-[240px]">
        <div className="flex items-center gap-2">
          <div className={`w-1.5 h-1.5 rounded-full ${pct >= 80 ? 'bg-accent-rose animate-pulse' : 'bg-accent-purple'}`} />
          <span className="text-text-secondary font-mono text-xs">
            {tokenCount.toLocaleString()} / {maxTokens.toLocaleString()}
          </span>
        </div>
        <div className="flex-1 h-1 bg-bg-hover rounded-full overflow-hidden">
          <div
            className={`h-full ${barColor} rounded-full transition-all duration-500`}
            style={{ width: `${Math.min(pct, 100)}%` }}
          />
        </div>
      </div>

      {/* Cost */}
      <div className="flex items-center gap-2">
        <span className="text-text-muted text-xs">Cost</span>
        <span className="text-text-primary font-mono font-medium">${cost.toFixed(2)}</span>
      </div>

      {/* Model */}
      <div className="flex items-center gap-2">
        <span className="text-text-muted text-xs">Model</span>
        <span className="text-accent-purple font-mono text-xs font-medium">{model}</span>
      </div>

      {/* Agent status */}
      <div className="flex items-center gap-2 ml-auto" data-testid="agent-status">
        <div className={`w-2 h-2 rounded-full ${status.dot}`} />
        <span className={`${status.color} font-medium text-xs`}>{status.label}</span>
      </div>
    </div>
  )
}

export default ContextGauge
