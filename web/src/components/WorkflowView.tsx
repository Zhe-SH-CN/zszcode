import React from 'react'
import AgentTreeNode from './AgentTreeNode'
import type { AgentNode } from '../types/events'

export interface WorkflowViewProps {
  rootNode: AgentNode | null
}

export const WorkflowView: React.FC<WorkflowViewProps> = ({ rootNode }) => {
  return (
    <div
      data-testid="workflow-view"
      className="flex-1 overflow-auto p-4"
    >
      {rootNode ? (
        <AgentTreeNode node={rootNode} depth={0} isRoot />
      ) : (
        <p className="text-gray-500 text-sm text-center mt-8">
          Waiting for agent activity...
        </p>
      )}
    </div>
  )
}

export default WorkflowView
