export interface CachedMCState {
  [key: string]: unknown
}

export interface CacheEditsBlock {
  [key: string]: unknown
}

export interface PinnedCacheEdits {
  [key: string]: unknown
}

export function isCachedMicrocompactEnabled(): boolean {
  throw new Error('cachedMicrocompact not implemented')
}

export function isModelSupportedForCacheEditing(_model: string): boolean {
  throw new Error('cachedMicrocompact not implemented')
}

export function getCachedMCConfig(): { supportedModels: string[] } {
  throw new Error('cachedMicrocompact not implemented')
}

export function createCachedMCState(): CachedMCState {
  throw new Error('cachedMicrocompact not implemented')
}

export function resetCachedMCState(_state: CachedMCState): void {
  throw new Error('cachedMicrocompact not implemented')
}

export function createCacheEditsBlock(
  _state: CachedMCState,
  _toolsToDelete: string[],
): CacheEditsBlock {
  throw new Error('cachedMicrocompact not implemented')
}

export function getToolResultsToDelete(): string[] {
  throw new Error('cachedMicrocompact not implemented')
}

export function registerToolMessage(_message: unknown): void {
  throw new Error('cachedMicrocompact not implemented')
}

export function registerToolResult(_result: unknown): void {
  throw new Error('cachedMicrocompact not implemented')
}
