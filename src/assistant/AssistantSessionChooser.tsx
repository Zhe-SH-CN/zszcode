import React from 'react'

export interface AssistantSessionChooserProps {
  sessions: Array<{ id: string; name?: string }>
  onSelect: (id: string) => void
  onCancel: () => void
}

export function AssistantSessionChooser(_props: AssistantSessionChooserProps): React.ReactElement {
  throw new Error('AssistantSessionChooser not implemented')
}
