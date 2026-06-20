// Snip compact - handles history snipping for context efficiency

import type { Message } from '../../messages.js'

export function snipCompactIfNeeded(
  _messages: Message[],
  _options?: { force?: boolean },
): Message[] {
  throw new Error('snipCompact not implemented')
}

export function isSnipBoundaryMessage(_message: Message): boolean {
  throw new Error('snipCompact not implemented')
}

export function isSnipRuntimeEnabled(): boolean {
  throw new Error('snipCompact not implemented')
}

export function shouldNudgeForSnips(_messages: Message[]): boolean {
  throw new Error('snipCompact not implemented')
}

export function appendMessageTagToUserMessage(message: Message): Message {
  throw new Error('snipCompact not implemented')
}
