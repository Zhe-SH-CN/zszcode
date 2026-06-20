import { useState, useCallback } from 'react'

export interface Session {
  id: string
  name: string
  createdAt: number
}

export interface UseSessionResult {
  sessions: Session[]
  activeSessionId: string
  switchSession: (id: string) => void
  createSession: (name?: string) => void
}

let nextId = 1
function generateId(): string {
  return `session-${Date.now()}-${nextId++}`
}

export function useSession(): UseSessionResult {
  const [sessions, setSessions] = useState<Session[]>(() => [
    { id: generateId(), name: 'Default', createdAt: Date.now() },
  ])
  const [activeSessionId, setActiveSessionId] = useState<string>(() => '')

  // Initialize activeSessionId after first render if empty
  const resolvedActiveId = activeSessionId || sessions[0]?.id || ''

  const switchSession = useCallback((id: string) => {
    setActiveSessionId(id)
  }, [])

  const createSession = useCallback(
    (name?: string) => {
      const id = generateId()
      const newSession: Session = {
        id,
        name: name || `Session ${Date.now()}`,
        createdAt: Date.now(),
      }
      setSessions((prev) => [...prev, newSession])
      setActiveSessionId(id)
    },
    [],
  )

  return {
    sessions,
    activeSessionId: resolvedActiveId,
    switchSession,
    createSession,
  }
}
