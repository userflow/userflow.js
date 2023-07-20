type BrowserTarget = 'es2020' | 'legacy'

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
 */
export function detectBrowserTarget(agent: string): BrowserTarget {
  var options: [RegExp, RegExp, number][] = [
    // Edge. Can contain "Chrome", so must come before Chrome.
    [/Edg\//, /Edg\/(\d+)/, 80],
    // Opera. Can contain "Chrome", so must come before Chrome
    [/OPR\//, /OPR\/(\d+)/, 67],
    // Chrome. Can contain "Safari", so must come before Safari.
    [/Chrome\//, /Chrome\/(\d+)/, 80],
    // Chrome on iOS. Can contain "Safari", so must come before Safari.
    // I'm not sure exactly what the engine driving Chrome iOS is, but assuming
    // it's based on iOS Safari, which hit v14 (that's es2020 compatible) on
    // September 16, 2020, and CriOS apparently hit v100 in April 11, 2022, we
    // just go with 100.
    [/CriOS\//, /CriOS\/(\d+)/, 100],
    // Safari
    [/Safari\//, /Version\/(\d+)/, 14],
    // Firefox
    [/Firefox\//, /Firefox\/(\d+)/, 74]
  ]
  for (var i = 0; i < options.length; i++) {
    var option = options[i]
    var browserRegExp = option[0]
    var versionRegExp = option[1]
    var minVersion = option[2]
    if (!agent.match(browserRegExp)) {
      // No this browser
      continue
    }
    // Must be this browser, so version has to be found and be greater than
    // minVersion, otherwise we'll fall back to `legacy`.
    var versionMatch = agent.match(new RegExp(versionRegExp))
    if (versionMatch) {
      var version = parseInt(versionMatch[1], 10)
      if (version >= minVersion) {
        return 'es2020'
      }
    }
    break
  }
  return 'legacy'
}
