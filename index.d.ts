export interface Userflow {
  init: (token: string) => void
  identify: (externalId: string, params: IdentifyParams) => Promise<void>
  updateUser: (params: IdentifyParams) => Promise<void>
  isIdentified: () => boolean
  startFlow: (flowId: string) => Promise<void>
  endAllFlows: () => Promise<void>
  reset: () => void
  on(eventName: string, listener: (...args: any[]) => void): void
  off(eventName: string, listener: (...args: any[]) => void): void
  setCustomInputSelector(customInputSelector: string | null): void
  registerCustomInput(
    cssSelector: string,
    getValue?: (el: Element) => string
  ): void
  setCustomNavigate(customNavigate: ((url: string) => void) | null): void
  setScrollPadding(scrollPadding: ScrollPadding | null): void
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

export interface ScrollPadding {
  top?: number
  right?: number
  bottom?: number
  left?: number
}

export function loadUserflow(opts?: LoadUserflowOpts): Promise<Userflow>
