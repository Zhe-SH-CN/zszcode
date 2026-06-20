import { useState, useEffect, useRef, useCallback } from 'react'
import type { ZszCodeEvent } from '../types/events'

const MAX_BACKOFF = 16000
const INITIAL_BACKOFF = 1000

export interface UseWebSocketResult {
  events: ZszCodeEvent[]
  connected: boolean
  sendMessage: (data: unknown) => void
  reconnectAttempts: number
  unauthorized: boolean
}

export function useWebSocket(url: string): UseWebSocketResult {
  const [events, setEvents] = useState<ZszCodeEvent[]>([])
  const [connected, setConnected] = useState(false)
  const [reconnectAttempts, setReconnectAttempts] = useState(0)
  const [unauthorized, setUnauthorized] = useState(false)
  const wsRef = useRef<WebSocket | null>(null)
  const backoffRef = useRef(INITIAL_BACKOFF)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const mountedRef = useRef(true)

  const cleanup = useCallback(() => {
    if (timerRef.current !== null) {
      clearTimeout(timerRef.current)
      timerRef.current = null
    }
    if (wsRef.current) {
      wsRef.current.onclose = null
      wsRef.current.close()
      wsRef.current = null
    }
  }, [])

  const connect = useCallback(() => {
    cleanup()
    const ws = new WebSocket(url)
    wsRef.current = ws

    ws.onopen = () => {
      if (!mountedRef.current) return
      setConnected(true)
      setUnauthorized(false)
      backoffRef.current = INITIAL_BACKOFF
      setReconnectAttempts(0)
    }

    ws.onmessage = (ev) => {
      if (!mountedRef.current) return
      try {
        const parsed = JSON.parse(ev.data) as ZszCodeEvent
        setEvents((prev) => [...prev, parsed])
      } catch {
        // ignore non-JSON messages
      }
    }

    ws.onclose = (ev) => {
      if (!mountedRef.current) return
      setConnected(false)

      // 4001 = unauthorized
      if (ev.code === 4001) {
        setUnauthorized(true)
        return
      }

      // auto-reconnect with exponential backoff
      const delay = backoffRef.current
      setReconnectAttempts((n) => n + 1)
      timerRef.current = setTimeout(() => {
        if (mountedRef.current) {
          connect()
        }
      }, delay)

      // exponential backoff capped at MAX_BACKOFF
      backoffRef.current = Math.min(backoffRef.current * 2, MAX_BACKOFF)
    }

    ws.onerror = () => {
      // onclose will fire after onerror
    }
  }, [url, cleanup])

  useEffect(() => {
    mountedRef.current = true
    connect()

    return () => {
      mountedRef.current = false
      cleanup()
    }
  }, [connect, cleanup])

  const sendMessage = useCallback(
    (data: unknown) => {
      const ws = wsRef.current
      if (ws && ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify(data))
      }
      // silently drop when disconnected
    },
    [],
  )

  return { events, connected, sendMessage, reconnectAttempts, unauthorized }
}
