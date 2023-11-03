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

  load: () => Promise<void>

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
   * @deprecated Use `start` instead
   */
  startFlow: (contentId: string, opts?: StartOptions) => Promise<void>

  /**
   * @deprecated Use `start` instead
   */
  startWalk: (contentId: string, opts?: StartOptions) => Promise<void>

  endAll: () => Promise<void>

  /**
   * @deprecated Use `endAll` instead
   */
  endAllFlows: () => Promise<void>

  endChecklist: () => Promise<void>

  openResourceCenter: () => void

  closeResourceCenter: () => void

  toggleResourceCenter: () => void

  setResourceCenterLauncherHidden: (hidden: boolean) => void

  getResourceCenterState: () => ResourceCenterState | null

  reset: () => void

  remount: () => void

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

  setShadowDomEnabled(shadowDomEnabled: boolean): void

  setPageTrackingDisabled(pageTrackingDisabled: boolean): void

  setBaseZIndex(baseZIndex: number): void

  setServerEndpoint(serverEndpoint: string | null | undefined): void

  disableEvalJs(): void
}

// Helper types for userflow.js API
export interface Attributes {
  [name: string]: AttributeLiteralOrList | AttributeChange
}

type AttributeLiteral = string | number | boolean | null | undefined
type AttributeLiteralOrList = AttributeLiteral | AttributeLiteral[]

interface AttributeChange {
  set?: AttributeLiteralOrList
  set_once?: AttributeLiteralOrList
  add?: string | number
  subtract?: string | number
  append?: AttributeLiteralOrList
  prepend?: AttributeLiteralOrList
  remove?: AttributeLiteralOrList
  data_type?: AttributeDataType
}

type AttributeDataType = 'string' | 'boolean' | 'number' | 'datetime' | 'list'

export type IdentifyOptions = {
  signature?: string
}

export interface GroupOptions {
  signature?: string
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

export interface ResourceCenterState {
  isOpen: boolean
  hasChecklist: boolean
  uncompletedChecklistTaskCount: number
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
// Support importing userflow.js with server-side rendering by attaching to an
// empty object instead of `window`.
var w: WindowWithUserflow = typeof window === 'undefined' ? ({} as any) : window
var userflow = w.userflow
if (!userflow) {
  //
  var urlPrefix = 'https://js.userflow.com/'

  // Initialize as an empty object (methods will be stubbed below)
  var loadPromise: Promise<void> | null = null
  userflow = w.userflow = {
    _stubbed: true,
    // Helper to inject the proper Userflow.js script/module into the document
    load: function (): Promise<void> {
      // Make sure we only load Userflow.js once
      if (!loadPromise) {
        loadPromise = new Promise(function (resolve, reject) {
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
          script.onload = function () {
            resolve()
          }
          script.onerror = function () {
            document.head.removeChild(script)
            loadPromise = null
            var e = new Error('Could not load Userflow.js')
            console.error(e.message)
            reject(e)
          }
          document.head.appendChild(script)
        })
      }
      return loadPromise
    }
  } as Userflow

  // Initialize the queue, which will be flushed by Userflow.js when it loads
  var q = (w.USERFLOWJS_QUEUE = w.USERFLOWJS_QUEUE || [])

  /**
   * Helper to stub void-returning methods that should be queued
   */
  var stubVoid = function (
    // eslint-disable-next-line es5/no-rest-parameters
    method: ConditionalKeys<Userflow, (...args: any[]) => void>
  ) {
    userflow![method] = function () {
      var args = Array.prototype.slice.call(arguments)
      userflow!.load()
      q.push([method, null, args])
    } as any
  }

  // Helper to stub promise-returning methods that should be queued
  var stubPromise = function (
    // eslint-disable-next-line es5/no-rest-parameters
    method: ConditionalKeys<Userflow, (...args: any[]) => Promise<void>>
  ) {
    userflow![method] = function () {
      var args = Array.prototype.slice.call(arguments)
      userflow!.load()
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
  var stubDefault = function (
    method: ConditionalKeys<Userflow, () => any>,
    returnValue: any
  ) {
    userflow![method] = function () {
      return returnValue
    }
  }

  // Methods that return void and should be queued
  stubVoid('_setTargetEnv')
  stubVoid('closeResourceCenter')
  stubVoid('disableEvalJs')
  stubVoid('init')
  stubVoid('off')
  stubVoid('on')
  stubVoid('prepareAudio')
  stubVoid('registerCustomInput')
  stubVoid('remount')
  stubVoid('reset')
  stubVoid('setBaseZIndex')
  stubVoid('setCustomInputSelector')
  stubVoid('setCustomNavigate')
  stubVoid('setCustomScrollIntoView')
  stubVoid('setInferenceAttributeFilter')
  stubVoid('setInferenceAttributeNames')
  stubVoid('setInferenceClassNameFilter')
  stubVoid('setResourceCenterLauncherHidden')
  stubVoid('setScrollPadding')
  stubVoid('setServerEndpoint')
  stubVoid('setShadowDomEnabled')
  stubVoid('setPageTrackingDisabled')
  stubVoid('setUrlFilter')
  stubVoid('openResourceCenter')
  stubVoid('toggleResourceCenter')

  // Methods that return promises and should be queued
  stubPromise('endAll')
  stubPromise('endAllFlows') // deprecated
  stubPromise('endChecklist')
  stubPromise('group')
  stubPromise('identify')
  stubPromise('identifyAnonymous')
  stubPromise('start')
  stubPromise('startFlow') // deprecated
  stubPromise('startWalk') // deprecated
  stubPromise('track')
  stubPromise('updateGroup')
  stubPromise('updateUser')

  // Methods that synchronously return and can be stubbed with default return
  // values and are not queued
  stubDefault('getResourceCenterState', null)
  stubDefault('isIdentified', false)
}

export default userflow!
