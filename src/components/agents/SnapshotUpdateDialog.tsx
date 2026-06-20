import React from 'react'

export interface SnapshotUpdateDialogProps {
  agentType: string
  scope: string
  snapshotTimestamp: string
  onComplete: (action: 'merge' | 'keep' | 'replace') => void
  onCancel: () => void
}

export function SnapshotUpdateDialog(_props: SnapshotUpdateDialogProps): React.ReactElement {
  throw new Error('SnapshotUpdateDialog not implemented')
}
