import React, { useState } from 'react'
import ToolCallNode from './ToolCallNode'
import type { AgentNode } from '../types/events'

export interface AgentTreeNodeProps {
  node: AgentNode
  depth: number
  isRoot?: boolean
}

const MAX_DEPTH = 10

export const AgentTreeNode: React.FC<AgentTreeNodeProps> = ({
  node,
  depth,
  isRoot = false,
}) => {
  const [expanded, setExpanded] = useState(isRoot)
  const [showDetail, setShowDetail] = useState(false)
  const hasChildren = node.children.length > 0 || node.toolCalls.length > 0
  const shortId = node.id.slice(0, 8)

  const statusDot =
    node.status === 'running'
      ? 'bg-green-400 animate-pulse'
      : node.status === 'failed'
        ? 'bg-red-500'
        : 'bg-gray-500'

  const indent = Math.min(depth, MAX_DEPTH) * 24

  return (
    <div style={{ paddingLeft: `${indent}px` }}>
      <div
        data-testid="agent-node"
        className="bg-gray-800 border border-gray-700 rounded-lg p-3 mb-1"
      >
        <div className="flex items-center gap-2">
          {hasChildren ? (
            <button
              data-testid="expand-toggle"
              onClick={(e) => {
                e.stopPropagation()
                setExpanded((v) => !v)
              }}
              className="text-gray-400 hover:text-white text-xs w-4"
            >
              {expanded ? '▼' : '▶'}
            </button>
          ) : (
            <span className="w-4" />
          )}

          <span
            className={`w-2 h-2 rounded-full ${statusDot}`}
            data-testid="status-dot"
          />

          <span className="font-mono text-xs text-gray-400">{shortId}</span>
          <span className="font-bold text-sm text-gray-200">
            {node.agentType}
          </span>

          <div className="flex-1" />

          <button
            onClick={() => setShowDetail((v) => !v)}
            className="text-xs text-gray-500 hover:text-gray-300"
          >
            {showDetail ? 'Hide' : 'Details'}
          </button>
        </div>

        {showDetail && (
          <div
            data-testid="agent-detail-panel"
            className="mt-2 p-2 bg-gray-900 rounded text-xs font-mono text-gray-300 max-h-[300px] overflow-y-auto"
          >
            <div>ID: {node.id}</div>
            <div>Type: {node.agentType}</div>
            <div>Description: {node.description}</div>
          </div>
        )}
      </div>

      {expanded && (
        <div className="ml-2 border-l border-gray-700 pl-2">
          {node.toolCalls.map((tc, i) => (
            <ToolCallNode key={tc.toolUseId || i} toolCall={tc} />
          ))}
          {node.children.map((child) => (
            <AgentTreeNode
              key={child.id}
              node={child}
              depth={depth + 1}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export default AgentTreeNode
