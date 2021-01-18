# Userflow.js

Simple Userflow.js installation via npm. Suitable for modern web apps that use build systems such as Webpack, Browserify, Grunt etc.

The full Userflow.js script lives on our CDN at:

- Modern ES2020 browsers: https://js.userflow.com/es2020/userflow.js
- Legacy browsers: https://js.userflow.com/legacy/userflow.js

This module exports the `userflow` object, which supports all of Userflow.js' methods. The Userflow.js script is automatically injected into the current page when a method is called. Method calls are queued if Userflow.js is not loaded yet.

## Installation

```sh
npm install userflow.js
```

## Usage

Simply `import userflow from 'userflow.js'` and use it. Example:

```js
import userflow from 'userflow.js'

userflow.init('USERFLOW_TOKEN')
userflow.identify('USER_ID', {
  name: 'USER_NAME',
  email: 'USER_EMAIL',
  signed_up_at: 'USER_SIGNED_UP_AT' // ISO 8601 format
})
```

You can find your Userflow.js Token in Userflow under [Settings -> Environments](https://getuserflow.com/app/_/settings/environments). Note that if you have multiple environments (e.g. Production and Staging) that each environment has a unique token.

Check out the [installation instructions](https://getuserflow.com/docs/dev/userflow-js-installation) for more info.

## API Reference

See the [Userflow.js API Reference](https://getuserflow.com/docs/userflow-js).

## Importing userflow.js from multiple modules

You can import `userflow` from multiple files in your app. It will always refer to the same instance. The Userflow.js script will only be loaded once.

```js
// App.js
import userflow from 'userflow.js'

userflow.init('USERFLOW_TOKEN')

// UserRoute.js
import userflow from 'userflow.js'

userflow.identify(user.id, {
  name: user.name
})

// CompanyRoute.js
import userflow from 'userflow.js'

userflow.group(company.id, {
  name: company.name
})
```

## TypeScript support

This package contains TypeScript definitions of the `userflow` object.

## Developing userflow.js

Install dev dependencies:

```sh
npm install
```

To build, run:

```sh
npm run build
```

This will produce:

- `dist/userflow.es.js`: Bundlers supporting ES modules can use this.
- `dist/userflow.umd.js`: UMD build for bundlers that do not support ESmodules.
- Source maps for the above.
- `dist/userflow.snippet.js`: A minified script snippet that can be used by apps not using bundlers, or wanting to inject the code directly in a `<script>`.
