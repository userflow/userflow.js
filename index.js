// Once Userflow.js loads, we'll put the `window.userflow` object here
let userflow

// Contains queued operations for calls made before Userflow.js is loaded
let queue = []

// Makes sure we only try to load Userflow.js once
let loadUserflowPromise

// This object wraps all userflow operations, and is what this module exports.
// Consumers should `import userflow from 'userflow.js'` and use `userflow` from
// that directly. Userflow.js will automatically be loaded.
const userflowWrapper = {}

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
stubPromise('startFlow')
stubPromise('endAll')
stubPromise('endAllFlows')

// Methods that synchronously return and can be stubbed with default return
// values and are not queued
stubDefault('isIdentified', () => false)

// Helper to stub void-returning methods that should be queued
function stubVoid(method) {
  userflowWrapper[method] = function (...args) {
    if (userflow) {
      userflow[method].apply(userflow, args)
    } else {
      loadUserflow()
      queue.push({kind: 'void', method, args})
    }
  }
}

// Helper to stub promise-returning methods that should be queued
function stubPromise(method) {
  userflowWrapper[method] = function (...args) {
    if (userflow) {
      return userflow[method].apply(userflow, args)
    } else {
      loadUserflow()
      const deferred = new Deferred()
      queue.push({kind: 'promise', method, args, deferred})
      return deferred.promise
    }
  }
}

// Helper to stub returning methods that MUST return synchronously, and
// therefore must support using a default callback in case Userflow.js is not
// loaded yet.
function stubDefault(method, fallback) {
  userflowWrapper[method] = function (...args) {
    if (userflow) {
      return userflow[method].apply(userflow, args)
    } else {
      return fallback(...args)
    }
  }
}

// Called when Userflow.js is loaded
function flushQueue() {
  queue.forEach(item => {
    switch (item.kind) {
      case 'void': {
        const {method, args} = item
        userflow[method].apply(userflow, args)
        break
      }

      case 'promise': {
        const {method, args, deferred} = item
        userflow[method]
          .apply(userflow, args)
          .then(deferred.resolve, deferred.reject)
        break
      }
    }
  })
  // Forget the queue
  queue = []
}

// Both used by this module to automatically load Userflow.js, or for apps to
// load it on demand.
function loadUserflow() {
  // Make sure we only load Userflow.js once
  if (!loadUserflowPromise) {
    loadUserflowPromise = new Promise(function (resolve, reject) {
      // Load Userflow.js script
      const script = document.createElement('script')
      // Detect if the browser supports es2020
      const envVars = window.USERFLOWJS_ENV_VARS || {}
      const browserTarget =
        envVars.BROWSER_TARGET || detectBrowserTarget(navigator.userAgent)
      if (browserTarget === 'es2020') {
        script.type = 'module'
        script.src =
          envVars.USERFLOWJS_ES2020_URL ||
          'https://js.getuserflow.com/es2020/userflow.js'
      } else {
        script.src =
          envVars.USERFLOWJS_LEGACY_URL ||
          'https://js.getuserflow.com/userflow.js'
      }
      script.onload = function () {
        // Grab userflow object from window
        userflow = window.userflow
        if (!userflow) {
          reject(
            new Error(
              'Userflow.js script was loaded, but the userflow global was not found.'
            )
          )
          return
        }
        // Resolve load promise and flush the operation queue
        resolve(userflow)
        flushQueue()
      }
      script.onerror = function () {
        loadUserflowPromise = undefined
        reject(new Error('Could not load Userflow.js'))
      }
      document.head.appendChild(script)
    })
  }
  return loadUserflowPromise
}

/**
 * Returns `es2020` if the browser supports ES2020 features, `legacy` otherwise.
 *
 * It would be better to detect features, but there's no way to test e.g. if
 * dynamic imports are available in containing apps that may prevent `eval` via
 * their Content-Security-Policy.
 *
 * It's important that we don't mistake a legacy browser as es2020 (since that
 * may cause us to run an incompatible version), but it's okay to mistake an
 * es2020-capable browser and serve them the legacy version.
 *
 * The browser version numbers are based off of caniuse.com data of browsers
 * supporting ALL of the the following features:
 * - https://caniuse.com/es6-module-dynamic-import
 * - https://caniuse.com/mdn-javascript_operators_nullish_coalescing
 * - https://caniuse.com/mdn-javascript_operators_optional_chaining
 * - https://caniuse.com/bigint
 * - https://caniuse.com/mdn-javascript_builtins_promise_allsettled
 * - https://caniuse.com/mdn-javascript_builtins_globalthis
 * - https://caniuse.com/mdn-javascript_builtins_string_matchall
 *
 * Adopted from (and tested in) the userflow monorepo.
 */
export function detectBrowserTarget(agent) {
  const options = [
    // Edge. Can contain "Chrome", so must come before Chrome.
    [/Edg\//, /Edg\/(\d+)/, 80],
    // Opera. Can contain "Chrome", so must come before Chrome
    [/OPR\//, /OPR\/(\d+)/, 67],
    // Chrome. Can contain "Safari", so must come before Safari.
    [/Chrome\//, /Chrome\/(\d+)/, 80],
    // Safari
    [/Safari\//, /Version\/(\d+)/, 14],
    // Firefox
    [/Firefox\//, /Firefox\/(\d+)/, 74],
  ]
  for (const [browserRegExp, versionRegExp, minVersion] of options) {
    if (!agent.match(browserRegExp)) {
      // No this browser
      continue
    }
    // Must be this browser, so version has to be found and be greater than
    // minVersion, otherwise we'll fall back to `legacy`.
    const versionMatch = agent.match(new RegExp(versionRegExp))
    if (versionMatch) {
      const version = parseInt(versionMatch[1], 10)
      if (version >= minVersion) {
        return 'es2020'
      }
    }
    break
  }
  return 'legacy'
}

// To resolve/reject Promises later
class Deferred {
  constructor() {
    this.promise = new Promise((resolve, reject) => {
      this.resolve = resolve
      this.reject = reject
    })
  }
}

export default userflowWrapper
