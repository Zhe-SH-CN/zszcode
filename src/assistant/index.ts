/**
 * Assistant module - provides assistant mode detection and team initialization.
 *
 * This is a stub module for types that are imported via `typeof import()`.
 */

/**
 * Check if the current session is running in assistant mode.
 */
export function isAssistantMode(): boolean {
  return false
}

/**
 * Check if assistant mode was explicitly forced.
 */
export function isAssistantForced(): boolean {
  return false
}

/**
 * Mark assistant mode as forced.
 */
export function markAssistantForced(): void {
  // no-op stub
}

/**
 * Initialize assistant team context.
 */
export async function initializeAssistantTeam(): Promise<{
  teammateId?: string
  teamId?: string
  [key: string]: unknown
}> {
  return {}
}

/**
 * Get additional system prompt text for assistant mode.
 */
export function getAssistantSystemPromptAddendum(): string {
  return ''
}
