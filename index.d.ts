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

  setInferenceAttributeNames(attributeNames: string[]): void

  setInferenceAttributeFilter(
    attributeName: string,
    filters: StringFilters
  ): void

  setInferenceClassNameFilter(filters: StringFilters): void

  setScrollPadding(scrollPadding: ScrollPadding | null): void
}

export interface IdentifyParams {
  [name: string]: IdentifyParamsChangeLiteral | IdentifyParamsChange
}

type IdentifyParamsChangeLiteral = string | number | boolean | null

interface IdentifyParamsChange {
  set?: IdentifyParamsChangeLiteral
  set_once?: IdentifyParamsChangeLiteral
  add?: string | number
  subtract?: string | number
  data_type?: IdentifyParamsAttributeDataType
}

type IdentifyParamsAttributeDataType =
  | 'string'
  | 'boolean'
  | 'number'
  | 'datetime'

interface LoadUserflowOpts {
  url?: string
}

interface ScrollPadding {
  top?: number
  right?: number
  bottom?: number
  left?: number
}

type StringFilter = ((className: string) => boolean) | RegExp

type StringFilters = StringFilter | StringFilter[]

export function loadUserflow(opts?: LoadUserflowOpts): Promise<Userflow>
