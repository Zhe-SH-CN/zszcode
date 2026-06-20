import React, { useState } from 'react'
import type { ZszCodeEvent, ZszCodeEventType } from '../types/events'

export interface SignalCardProps {
  event: ZszCodeEvent
}

function typeColor(type: ZszCodeEventType): string {
  if (type.startsWith('api_stream')) return 'border-blue-500'
  if (type.startsWith('tool_')) return 'border-green-500'
  if (type.startsWith('agent_')) return 'border-purple-500'
  if (type.startsWith('mcp_')) return 'border-cyan-500'
  if (type.startsWith('skill_')) return 'border-orange-500'
  if (type === 'state_change' || type === 'context_compact')
    return 'border-yellow-500'
  if (type === 'hook_fire') return 'border-pink-500'
  if (type === 'message') return 'border-indigo-500'
  if (type.startsWith('turn_')) return 'border-teal-500'
  return 'border-gray-500'
}

function formatTimestamp(ts: number): string {
  const d = new Date(ts)
  const hh = String(d.getHours()).padStart(2, '0')
  const mm = String(d.getMinutes()).padStart(2, '0')
  const ss = String(d.getSeconds()).padStart(2, '0')
  const ms = String(d.getMilliseconds()).padStart(3, '0')
  return `${hh}:${mm}:${ss}.${ms}`
}

export const SignalCard: React.FC<SignalCardProps> = ({ event }) => {
  const [expanded, setExpanded] = useState(false)

  return (
    <div
      data-testid={expanded ? 'signal-card-expanded' : 'signal-card'}
      className={`bg-gray-800 rounded border-l-4 ${typeColor(event.type)} cursor-pointer hover:bg-gray-750 transition-colors`}
      onClick={() => setExpanded((v) => !v)}
    >
      <div className="flex items-center justify-between px-3 py-1.5">
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-400">
            {expanded ? '▼' : '▶'}
          </span>
          <span className="font-bold text-xs text-gray-200">
            {event.type}
          </span>
        </div>
        <span className="text-xs text-gray-500 font-mono">
          {formatTimestamp(event.timestamp)}
        </span>
      </div>

      {expanded && (
        <div className="px-3 pb-2">
          <pre className="text-xs text-gray-300 font-mono bg-gray-900 rounded p-2 overflow-x-auto max-h-[400px] overflow-y-auto">
            {JSON.stringify(event, null, 2)}
          </pre>
        </div>
      )}
    </div>
  )
}

export default SignalCard
