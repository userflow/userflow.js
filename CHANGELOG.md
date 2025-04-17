# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/), and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [v2.13.0]

- Added `userflow.debugger()` to toggle the internal debugger for testing user flows.

## [v2.12.1]

- Demote log level from error to warn
- Patched the history API methods, such as pushState and replaceState, to trigger a custom userflow:pushstate and userflow:replacestate events whenever the state changes, improving our handling of these changes.

## [v2.12.0]

- Added `userflow.setLinkUrlDecorator()` method to override how Userflow.js displays links to e.g. your knowledge base. [See Userflow.js docs](https://userflow.com/docs/userflow-js#setlinkurldecorator)

## [v2.11.0]

- Added `unreadAnnouncementCount` field to `ResourceCenterState` object, which represents the number of unread announcements.

## [v2.10.0]

- Added `userflow.disableEvalJs()` to block all "Evaluate Javascript" actions from running.

## [v2.9.0]

### Added

- Added `userflow.setServerEndpoint()` to override which server Userflow.js should connect to. For advanced use with self-hosted proxy.

## [v2.8.0]

### Fixed

- Detect Chrome iOS (starting a little arbitrarily at v100) as es2020 compatible (instead of serving it the legacy bundle).

## [v2.7.0]

### Added

- Added `userflow.setBaseZIndex()` to override Userflow's default base z-index of `1234500`.

## [v2.6.0]

### Added

- Added `userflow.load()`, which returns a `Promise` that resolves once the full Userflow.js has been loaded from our CDN, or rejects if it fails.

## [v2.5.0]

### Added

- Added types for new list data type and append/prepend/remove list operations

## [v2.4.0]

### Added

- Added `userflow.setPageTrackingDisabled()` to turn off auto tracking of page_viewed events

## [v2.3.0]

### Added

- Added stubs of new resource center related methods: `userflow.openResourceCenter()`, `userflow.closeResourceCenter()`, `userflow.toggleResourceCenter()`, `userflow.setResourceCenterLauncherHidden()`, `userflow.getResourceCenterState()`. [See Userflow.js docs](https://userflow.com/docs/userflow-js#resource-center)

## [v2.2.0]

### Added

- Added typings for `signature` option in `userflow.identify()` and `userflow.group()` (for use with upcoming identity verification).

## [v2.1.2]

### Fixed

- Added missing stub of `userflow.start` method.

## [v2.1.1]

### Fixed

- Support importing `userflow.js` with server-side rendering such as with Next.js.

## [v2.1.0]

### Added

- Added some missing stubbed missing implementations so they can be used before proper Userflow.js is loaded from CDN.

## [v2.0.0]

### Added

- `module` build in ESM format.
- It will now detect whether the user's browser supports ES2020 features and load either a modern Userflow.js version (small and fast in modern browsers) or a legacy Userflow.js version (larger but supports older browsers).

### Changed

- Now only using ES5 syntax (enforced via ESLint rules) to possibly support IE11 without transpilation one day.
- BREAKING CHANGE: The scripts are now loaded from `js.userflow.com` instead of `js.getuserflow.com`, which means your app's Content Security header may need an update. [Please consult our CSP guide](https://userflow.com/docs/dev/csp).

### Removed

- `loadUserflow()` was removed. Calling any of the `userflow.*()` methods will automatically load Userflow.js from CDN.
- Deprecated `userflow.startFlow()` was removed. Use `userflow.start()` instead.
- Deprecated `userflow.endAllFlows()` was removed. Use `userflow.endAll()` instead.
- Deprecated `IdentifyParams` type was removed. Use `Attributes` instead.
- Deprecated `immediate: boolean` option was removed - no longer relevant.

[unreleased]: https://github.com/userflow/userflow.js/compare/v2.13.0...HEAD
[v2.13.0]: https://github.com/userflow/userflow.js/compare/v2.12.1...v2.13.0
[v2.12.1]: https://github.com/userflow/userflow.js/compare/v2.12.0...v2.12.1
[v2.12.0]: https://github.com/userflow/userflow.js/compare/v2.11.0...v2.12.0
[v2.11.0]: https://github.com/userflow/userflow.js/compare/v2.10.0...v2.11.0
[v2.10.0]: https://github.com/userflow/userflow.js/compare/v2.9.0...v2.10.0
[v2.9.0]: https://github.com/userflow/userflow.js/compare/v2.8.0...v2.9.0
[v2.8.0]: https://github.com/userflow/userflow.js/compare/v2.7.0...v2.8.0
[v2.7.0]: https://github.com/userflow/userflow.js/compare/v2.6.0...v2.7.0
[v2.6.0]: https://github.com/userflow/userflow.js/compare/v2.5.0...v2.6.0
[v2.5.0]: https://github.com/userflow/userflow.js/compare/v2.4.0...v2.5.0
[v2.4.0]: https://github.com/userflow/userflow.js/compare/v2.3.0...v2.4.0
[v2.3.0]: https://github.com/userflow/userflow.js/compare/v2.2.0...v2.3.0
[v2.2.0]: https://github.com/userflow/userflow.js/compare/v2.1.2...v2.2.0
[v2.1.2]: https://github.com/userflow/userflow.js/compare/v2.1.1...v2.1.2
[v2.1.1]: https://github.com/userflow/userflow.js/compare/v2.1.0...v2.1.1
[v2.1.0]: https://github.com/userflow/userflow.js/compare/v2.0.0...v2.1.0
[v2.0.0]: https://github.com/userflow/userflow.js/compare/v1.8.0...v2.0.0
