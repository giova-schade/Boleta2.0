import { SASjsRequest } from '@sasjs/adapter'

export interface SASjsRequestExtended extends SASjsRequest {
  parsedTimestamp?: string
  logErrors?: string[]
  logWarnings?: string[]
  selectedTable?: string
}
