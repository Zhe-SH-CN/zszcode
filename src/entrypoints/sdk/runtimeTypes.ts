// SDK Runtime Types - Types used at runtime by SDK consumers and builders

export type EffortLevel = 'low' | 'medium' | 'high' | 'max'

export interface AnyZodRawShape {
  [key: string]: unknown
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type InferShape<T> = any

export interface Options {
  [key: string]: unknown
}

export interface Query {
  [key: string]: unknown
}

export interface InternalOptions extends Options {
  [key: string]: unknown
}

export interface InternalQuery extends Query {
  [key: string]: unknown
}

export interface SDKSession {
  [key: string]: unknown
}

export interface SDKSessionOptions {
  [key: string]: unknown
}

export interface SessionMessage {
  [key: string]: unknown
}

export interface ListSessionsOptions {
  [key: string]: unknown
}

export interface GetSessionInfoOptions {
  [key: string]: unknown
}

export interface GetSessionMessagesOptions {
  [key: string]: unknown
}

export interface SessionMutationOptions {
  [key: string]: unknown
}

export interface ForkSessionOptions {
  [key: string]: unknown
}

export interface ForkSessionResult {
  [key: string]: unknown
}

export interface SdkMcpToolDefinition {
  [key: string]: unknown
}

export interface McpSdkServerConfigWithInstance {
  [key: string]: unknown
}
