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
function loadUserflow(opts) {
  opts = opts || {}
  // Make sure we only load Userflow.js once
  if (!loadUserflowPromise) {
    loadUserflowPromise = new Promise(function (resolve, reject) {
      // Load Userflow.js script
      const script = document.createElement('script')
      script.src =
        opts.url ||
        window.USERFLOWJS_URL ||
        'https://js.getuserflow.com/userflow.js'
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
userflowWrapper.loadUserflow = loadUserflow

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
export {loadUserflow}
