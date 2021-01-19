import type {ConditionalKeys} from 'type-fest'
import {detectBrowserTarget} from './detect-browser-target'

// `userflow` lives on the `window` object
interface WindowWithUserflow extends Window {
  userflow?: Userflow

  // Array of `[method, deferred?, args]` tuples
  USERFLOWJS_QUEUE?: [string, Deferred | null, any[]][]

  USERFLOWJS_ENV_VARS?: Record<string, any>
}

// userflow.js API
export interface Userflow {
  _stubbed: boolean

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

  endAll: () => Promise<void>

  reset: () => void

  // eslint-disable-next-line es5/no-rest-parameters
  on(eventName: string, listener: (...args: any[]) => void): void

  // eslint-disable-next-line es5/no-rest-parameters
  off(eventName: string, listener: (...args: any[]) => void): void

  setCustomInputSelector(customInputSelector: string | null): void

  registerCustomInput(
    cssSelector: string,
    getValue?: (el: Element) => string
  ): void

  setCustomNavigate(customNavigate: ((url: string) => void) | null): void

  setUrlFilter(urlFilter: ((url: string) => string) | null): void

  setInferenceAttributeNames(attributeNames: string[]): void

  setInferenceAttributeFilter(
    attributeName: string,
    filters: StringFilters
  ): void

  setInferenceClassNameFilter(filters: StringFilters): void

  setScrollPadding(scrollPadding: ScrollPadding | null): void

  setCustomScrollIntoView(scrollIntoView: ((el: Element) => void) | null): void

  prepareAudio(): void

  _setTargetEnv(targetEnv: unknown): void
}

// Helper types for userflow.js API
export interface Attributes {
  [name: string]: AttributeLiteral | AttributeChange
}

type AttributeLiteral = string | number | boolean | null | undefined

interface AttributeChange {
  set?: AttributeLiteral
  set_once?: AttributeLiteral
  add?: string | number
  subtract?: string | number
  data_type?: AttributeDataType
}

type AttributeDataType = 'string' | 'boolean' | 'number' | 'datetime'

export type IdentifyOptions = Record<string, never>

export interface GroupOptions {
  membership?: Attributes
}

export interface EventAttributes {
  [name: string]: AttributeLiteral | EventAttributeChange
}

interface EventAttributeChange {
  set?: AttributeLiteral
  data_type?: AttributeDataType
}

export interface TrackOptions {
  userOnly?: boolean
}

export interface StartOptions {
  once?: boolean
}

interface ScrollPadding {
  top?: number
  right?: number
  bottom?: number
  left?: number
}

type StringFilter = ((className: string) => boolean) | RegExp

type StringFilters = StringFilter | StringFilter[]

interface Deferred {
  resolve: () => void
  reject: (e: any) => void
}

// If window.userflow has not been initalized yet, then stub all its methods, so
// it can be used immediately, and load the Userflow.js script from CDN.
var w: WindowWithUserflow = window
var userflow = w.userflow
if (!userflow) {
  //
  var urlPrefix = 'https://js.userflow.com/'

  // Initialize as an empty object (methods will be stubbed below)
  userflow = w.userflow = {
    _stubbed: true
  } as Userflow

  // Initialize the queue, which will be flushed by Userflow.js when it loads
  var q = (w.USERFLOWJS_QUEUE = w.USERFLOWJS_QUEUE || [])

  /**
   * Helper to stub void-returning methods that should be queued
   */
  function stubVoid(
    // eslint-disable-next-line es5/no-rest-parameters
    method: ConditionalKeys<Userflow, (...args: any[]) => void>
  ) {
    userflow![method] = function () {
      var args = Array.prototype.slice.call(arguments)
      loadUserflow()
      q.push([method, null, args])
    } as any
  }

  // Helper to stub promise-returning methods that should be queued
  function stubPromise(
    // eslint-disable-next-line es5/no-rest-parameters
    method: ConditionalKeys<Userflow, (...args: any[]) => Promise<void>>
  ) {
    userflow![method] = function () {
      var args = Array.prototype.slice.call(arguments)
      loadUserflow()
      var deferred: Deferred
      var promise = new Promise<void>(function (resolve, reject) {
        deferred = {resolve: resolve, reject: reject}
      })
      q.push([method, deferred!, args])
      return promise
    } as any
  }

  // Helper to stub methods that MUST return a value synchronously, and
  // therefore must support using a default callback until Userflow.js is
  // loaded.
  function stubDefault(
    method: ConditionalKeys<Userflow, () => any>,
    returnValue: any
  ) {
    userflow![method] = function () {
      return returnValue
    }
  }

  // Helper to inject the proper Userflow.js script/module into the document
  var userflowLoaded = false
  function loadUserflow(): void {
    // Make sure we only load Userflow.js once
    if (userflowLoaded) {
      return
    }
    userflowLoaded = true
    var script = document.createElement('script')
    script.async = true
    // Detect if the browser supports es2020
    var envVars = w.USERFLOWJS_ENV_VARS || {}
    var browserTarget =
      envVars.USERFLOWJS_BROWSER_TARGET ||
      detectBrowserTarget(navigator.userAgent)
    if (browserTarget === 'es2020') {
      script.type = 'module'
      script.src =
        envVars.USERFLOWJS_ES2020_URL || urlPrefix + 'es2020/userflow.js'
    } else {
      script.src =
        envVars.USERFLOWJS_LEGACY_URL || urlPrefix + 'legacy/userflow.js'
    }
    script.onerror = function () {
      userflowLoaded = false
      console.error('Could not load Userflow.js')
    }
    document.head.appendChild(script)
  }

  // Methods that return void and should be queued
  stubVoid('init')
  stubVoid('reset')
  stubVoid('on')
  stubVoid('off')
  stubVoid('setCustomInputSelector')
  stubVoid('registerCustomInput')
  stubVoid('setCustomNavigate')
  stubVoid('setUrlFilter')
  stubVoid('setInferenceAttributeNames')
  stubVoid('setInferenceAttributeFilter')
  stubVoid('setInferenceClassNameFilter')
  stubVoid('setScrollPadding')
  stubVoid('setCustomScrollIntoView')
  stubVoid('prepareAudio')
  stubVoid('_setTargetEnv')

  // Methods that return promises and should be queued
  stubPromise('identify')
  stubPromise('identifyAnonymous')
  stubPromise('updateUser')
  stubPromise('group')
  stubPromise('updateGroup')
  stubPromise('track')
  stubPromise('start')
  stubPromise('endAll')

  // Methods that synchronously return and can be stubbed with default return
  // values and are not queued
  stubDefault('isIdentified', false)
}

export default userflow!
