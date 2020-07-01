export interface Userflow {
  init: (token: string) => void

  identify: (
    userId: string,
    attributes?: Attributes,
    opts?: IdentifyOptions
  ) => Promise<void>

  identifyAnonymous: (
    attributes?: Attributes,
    opts?: IdentifyOptions
  ) => Promise<void>

  updateUser: (attributes: Attributes, opts?: IdentifyOptions) => Promise<void>

  group: (
    groupId: string,
    attributes?: Attributes,
    opts?: GroupOptions
  ) => Promise<void>

  updateGroup: (attributes: Attributes, opts?: GroupOptions) => Promise<void>

  track(
    name: string,
    attributes?: EventAttributes,
    opts?: TrackOptions
  ): Promise<void>

  isIdentified: () => boolean

  start: (contentId: string, opts?: StartOptions) => Promise<void>

  /**
   * @deprecated Use userflow.start() instead
   */
  startFlow: (flowId: string) => Promise<void>

  endAll: () => Promise<void>

  /**
   * @deprecated Use userflow.endAll() instead
   */
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

  setCustomScrollIntoView(scrollIntoView: ((el: Element) => void) | null): void

  prepareAudio(): void

  loadUserflow(opts?: LoadUserflowOpts): Promise<Userflow>
}

export interface Attributes {
  [name: string]: AttributeLiteral | AttributeChange
}

/**
 *  @deprecated Use Attributes instead.
 */
export type IdentifyParams = Attributes

type AttributeLiteral = string | number | boolean | null | undefined

interface AttributeChange {
  set?: AttributeLiteral
  set_once?: AttributeLiteral
  add?: string | number
  subtract?: string | number
  data_type?: AttributeDataType
}

type AttributeDataType = 'string' | 'boolean' | 'number' | 'datetime'

interface BufferedOperationOptions {
  /**
   * @deprecated This option no longer has any effect. All operations are sent
   * immediately.
   */
  immediate?: boolean
}

export interface IdentifyOptions extends BufferedOperationOptions {}

export interface GroupOptions extends BufferedOperationOptions {
  membership?: Attributes
}

export interface EventAttributes {
  [name: string]: AttributeLiteral | EventAttributeChange
}

interface EventAttributeChange {
  set?: AttributeLiteral
  data_type?: AttributeDataType
}

export interface TrackOptions extends BufferedOperationOptions {
  userOnly?: boolean
}

export interface StartOptions {
  once?: boolean
}

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

declare let userflow: Userflow
export default userflow
