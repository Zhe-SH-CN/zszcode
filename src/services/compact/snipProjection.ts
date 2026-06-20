/**
 * Snip projection service - provides view projection for snipped messages.
 *
 * This is a stub module. The full implementation lives in snipCompact.ts.
 */

import type { Message } from '../../types/message.js'

/**
 * Check if a message is a snip boundary message.
 */
export function isSnipBoundaryMessage(_message: Message): boolean {
  return false
}

/**
 * Project a snipped view of messages, removing snipped content.
 */
export function projectSnippedView<T extends Message>(messages: T[]): T[] {
  return messages
}
