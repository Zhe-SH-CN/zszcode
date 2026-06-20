// Stub for contextCollapse service
export interface ContextCollapseCommitEntry {
  hash: string
  message: string
  timestamp: number
}

export interface ContextCollapseSnapshotEntry {
  content: string
  timestamp: number
}

export function isContextCollapseEnabled(): boolean {
  return false
}
