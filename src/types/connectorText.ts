// Connector text types for streaming text content

export interface ConnectorTextBlock {
  type: 'connector_text'
  text: string
  [key: string]: unknown
}

export interface ConnectorTextDelta {
  type: 'connector_text_delta'
  text: string
  [key: string]: unknown
}

export function isConnectorTextBlock(block: unknown): block is ConnectorTextBlock {
  return (
    typeof block === 'object' &&
    block !== null &&
    'type' in block &&
    (block as { type: string }).type === 'connector_text'
  )
}
