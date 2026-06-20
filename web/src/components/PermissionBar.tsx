import React, { useState, useEffect, useRef } from 'react'

export interface PermissionBarProps {
  toolName: string
  toolUseId: string
  input: unknown
  onAllow: () => void
  onDeny: () => void
  onAllowAlways: () => void
  sendMessage?: (data: unknown) => void
}

const COUNTDOWN_SECS = 30

export const PermissionBar: React.FC<PermissionBarProps> = ({
  toolName,
  toolUseId,
  input,
  onAllow,
  onDeny,
  onAllowAlways,
  sendMessage,
}) => {
  const [showInput, setShowInput] = useState(false)
  const [secondsLeft, setSecondsLeft] = useState(COUNTDOWN_SECS)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    timerRef.current = setInterval(() => {
      setSecondsLeft((s) => {
        if (s <= 1) {
          clearInterval(timerRef.current!)
          onDeny()
          return 0
        }
        return s - 1
      })
    }, 1000)

    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [onDeny])

  const handleDecision = (decision: 'allow' | 'deny' | 'allow_always') => {
    if (sendMessage) {
      sendMessage({ type: 'permission_response', toolUseId, decision })
    }
    if (decision === 'allow') onAllow()
    else if (decision === 'deny') onDeny()
    else onAllowAlways()
  }

  const countdownColor = secondsLeft <= 10 ? 'text-red-400' : 'text-gray-300'

  return (
    <div
      data-testid="permission-bar"
      className="fixed bottom-0 left-0 right-0 z-50 bg-gray-800 border-t border-yellow-600 px-4 py-3"
    >
      <div className="flex items-center gap-4">
        <span className="font-bold text-yellow-400" data-testid="permission-tool-name">
          {toolName}
        </span>

        <button
          data-testid="toggle-input-button"
          onClick={() => setShowInput((v) => !v)}
          className="text-xs text-gray-400 hover:text-gray-200"
        >
          {showInput ? 'Hide input ▼' : 'Show input ▶'}
        </button>

        {showInput && (
          <pre
            data-testid="permission-input-json"
            className="text-xs text-gray-300 bg-gray-900 rounded p-2 max-h-[200px] overflow-y-auto font-mono"
          >
            {typeof input === 'string' ? input : JSON.stringify(input, null, 2)}
          </pre>
        )}

        <div className="flex-1" />

        <span className={`text-sm font-mono ${countdownColor}`} data-testid="countdown">
          {secondsLeft}s
        </span>

        <button
          data-testid="allow-button"
          onClick={() => handleDecision('allow')}
          className="px-3 py-1 text-sm bg-green-600 hover:bg-green-700 text-white rounded transition-colors"
        >
          Allow
        </button>
        <button
          data-testid="deny-button"
          onClick={() => handleDecision('deny')}
          className="px-3 py-1 text-sm bg-red-600 hover:bg-red-700 text-white rounded transition-colors"
        >
          Deny
        </button>
        <button
          data-testid="allow-always-button"
          onClick={() => handleDecision('allow_always')}
          className="px-3 py-1 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded transition-colors"
        >
          Allow Always
        </button>
      </div>
    </div>
  )
}

export default PermissionBar
