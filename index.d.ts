export interface Userflow {
  init: (token: string) => void
  identify: (externalId: string, params: IdentifyParams) => Promise<void>
  updateUser: (params: IdentifyParams) => Promise<void>
  isIdentified: () => boolean
  startFlow: (flowId: string) => Promise<void>
  reset: () => void
  on(eventName: string, listener: (...args: any[]) => void): void
  off(eventName: string, listener: (...args: any[]) => void): void
  setCustomInputSelector(customInputSelector: string | null): void
}

export interface IdentifyParams {
  name?: string | null
  email?: string | null
  signedUpAt?: string | null
  traits?: IdentifyParamsTraits
}

type IdentifyParamsTraits =
  | IdentifyParamsTraitsHash
  | IdentifyParamsTraitItem[]
  | null

interface IdentifyParamsTraitsHash {
  [key: string]: string | boolean | number
}

interface IdentifyParamsTraitItem {
  name: string
  value: string | boolean | number
  dataType?: IdentifyParamsAttributeDataType
}

type IdentifyParamsAttributeDataType =
  | 'string'
  | 'boolean'
  | 'integer'
  | 'decimal'
  | 'datetime'

interface LoadUserflowOpts {
  url?: string
}

export function loadUserflow(opts?: LoadUserflowOpts): Promise<Userflow>
