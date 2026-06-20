import React, { useState, useEffect, useRef, useMemo } from 'react'
import SignalFilter from './SignalFilter'
import SignalCard from './SignalCard'
import type { ZszCodeEvent, ZszCodeEventType } from '../types/events'

export interface SignalsViewProps {
  events: ZszCodeEvent[]
}

/** Maps event type to filter group */
function eventToFilterGroup(type: ZszCodeEventType): string {
  if (type.startsWith('api_stream')) return 'API Stream'
  if (type.startsWith('tool_')) return 'Tool Call'
  if (type.startsWith('agent_')) return 'Agent'
  if (type.startsWith('mcp_')) return 'MCP'
  if (type.startsWith('skill_')) return 'Skill'
  if (type === 'state_change' || type === 'context_compact') return 'State'
  if (type === 'hook_fire') return 'Hook'
  if (type === 'message') return 'Message'
  if (type.startsWith('turn_')) return 'Turn'
  if (type === 'tool_permission_request' || type === 'tool_permission_resolved')
    return 'Permission'
  return 'Context'
}

const ALL_FILTER_GROUPS = [
  'API Stream',
  'Tool Call',
  'Permission',
  'Agent',
  'MCP',
  'Skill',
  'State',
  'Hook',
  'Context',
  'Message',
  'Turn',
]

export const SignalsView: React.FC<SignalsViewProps> = ({ events }) => {
  const [activeFilters, setActiveFilters] = useState<Set<string>>(
    () => new Set(ALL_FILTER_GROUPS),
  )
  const [paused, setPaused] = useState(false)
  const [newCount, setNewCount] = useState(0)
  const listRef = useRef<HTMLDivElement>(null)
  const prevLenRef = useRef(events.length)

  const filteredEvents = useMemo(() => {
    return events
      .filter((ev) => activeFilters.has(eventToFilterGroup(ev.type)))
      .sort((a, b) => b.timestamp - a.timestamp) // newest first
  }, [events, activeFilters])

  // auto-scroll on new events when near bottom
  useEffect(() => {
    if (paused) {
      setNewCount((c) => c + (events.length - prevLenRef.current))
    } else {
      const el = listRef.current
      if (el) {
        const nearBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 50
        if (nearBottom || events.length === prevLenRef.current) {
          el.scrollTop = el.scrollHeight
        }
      }
    }
    prevLenRef.current = events.length
  }, [events.length, paused])

  const handleToggle = (group: string) => {
    setActiveFilters((prev) => {
      const next = new Set(prev)
      if (next.has(group)) next.delete(group)
      else next.add(group)
      return next
    })
  }

  const handleTogglePause = () => {
    setPaused((p) => {
      if (p) setNewCount(0) // reset count on resume
      return !p
    })
  }

  return (
    <div
      data-testid="signals-view"
      className="flex-1 flex flex-col overflow-hidden"
    >
      <SignalFilter
        activeFilters={activeFilters}
        onToggle={handleToggle}
        allGroups={ALL_FILTER_GROUPS}
      />

      <div
        ref={listRef}
        className="flex-1 overflow-y-auto p-2 space-y-1"
      >
        {filteredEvents.length === 0 ? (
          <p className="text-gray-500 text-sm text-center mt-8">
            No signals yet
          </p>
        ) : (
          filteredEvents.map((ev, i) => <SignalCard key={`${ev.timestamp}-${i}`} event={ev} />)
        )}
      </div>

      {/* Pause button */}
      <div className="relative">
        <button
          data-testid="pause-scroll-button"
          onClick={handleTogglePause}
          className="absolute bottom-2 right-2 w-10 h-10 rounded-full bg-gray-700 hover:bg-gray-600 text-white flex items-center justify-center shadow-lg transition-colors"
        >
          {paused ? '▶' : '⏸'}
        </button>
        {paused && newCount > 0 && (
          <span
            data-testid="new-event-count"
            className="absolute bottom-12 right-0 bg-blue-600 text-white text-xs px-2 py-0.5 rounded-full"
          >
            +{newCount}
          </span>
        )}
      </div>
    </div>
  )
}

export default SignalsView
