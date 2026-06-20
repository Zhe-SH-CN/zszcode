import React from 'react'

export interface NewInstallWizardProps {
  defaultDir: string
  onInstalled: (dir: string) => void
  onCancel: () => void
  onError: (message: string) => void
}

export function NewInstallWizard(_props: NewInstallWizardProps): React.ReactElement {
  throw new Error('NewInstallWizard not implemented')
}

export async function computeDefaultInstallDir(): Promise<string> {
  throw new Error('computeDefaultInstallDir not implemented')
}
