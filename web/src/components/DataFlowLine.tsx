import React from 'react'

export interface DataFlowLineProps {
  from: { x: number; y: number }
  to: { x: number; y: number }
  status: 'running' | 'completed' | 'failed'
}

const STATUS_COLORS: Record<string, string> = {
  running: '#22c55e',
  completed: '#6b7280',
  failed: '#ef4444',
}

export const DataFlowLine: React.FC<DataFlowLineProps> = ({
  from,
  to,
  status,
}) => {
  const color = STATUS_COLORS[status] || STATUS_COLORS.completed

  return (
    <svg
      data-testid="data-flow-line"
      className="absolute inset-0 pointer-events-none"
      style={{ overflow: 'visible' }}
    >
      <line
        x1={from.x}
        y1={from.y}
        x2={to.x}
        y2={to.y}
        stroke={color}
        strokeWidth={2}
        strokeDasharray="5 5"
        className={
          status === 'running'
            ? 'animate-flow'
            : ''
        }
        style={{
          transition: 'stroke 0.3s ease',
        }}
      />
    </svg>
  )
}

export default DataFlowLine
