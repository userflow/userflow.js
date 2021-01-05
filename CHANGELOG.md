# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/), and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- `module` build in ESM format.
- It will now detect whether the user's browser supports ES2020 features and load either a modern Userflow.js version (small and fast in modern browsers) or a legacy Userflow.js version (larger but supports older browsers).

### Changed

- Now only using ES5 syntax (enforced via ESLint rules) to possibly support IE11 without transpilation one day.

### Removed

- `loadUserflow()` was removed. Calling any of the `userflow.*()` methods will automatically load Userflow.js from CDN.
- Deprecated `userflow.startFlow()` was removed. Use `userflow.start()` instead.
- Deprecated `userflow.endAllFlows()` was removed. Use `userflow.endAll()` instead.
- Deprecated `IdentifyParams` type was removed. Use `Attributes` instead.
- Deprecated `immediate: boolean` option was removed - no longer relevant.

[unreleased]: https://github.com/userflow/userflow.js/compare/v1.8.0...HEAD
