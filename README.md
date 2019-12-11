# Userflow.js

Async loader for [Userflow](https://getuserflow.com)'s Userflow.js. This is the recommended way to install Userflow.js in modern web apps that use build systems such as Webpack, Browserify, Grunt etc.

## Documentation

See the [Userflow.js API Reference](https://getuserflow.com/docs/userflow-js).

## Installation

Install from npm:

```sh
npm install --save userflow.js
```

## Usage

This package exposes a single function, `loadUserflow`, which will inject Userflow.js asynchronously into the current page using a simple `<script>` tag. `loadUserflow` returns a promise resolving with the `userflow` object (the same one that's also available globally on `window`).

In your app, wherever you manage the currently signed-in user's data, initialize Userflow like this:

```js
import { loadUserflow } from 'userflow.js'

const userflow = await loadUserflow()
userflow.init('YOUR_COMPANY_ID')
userflow.identify('USER_ID', {
  name: 'USER_NAME',
  email: 'USER_EMAIL',
  signedUpAt: 'USER_SIGNED_UP_AT'
})
```

You can find your company ID in Userflow under [Settings](https://getuserflow.com/app/_/settings).

Check out the [installation instructions](https://getuserflow.com/docs/userflow-js-installation) for more info.

Also check out the [Userflow.js API Reference](https://getuserflow.com/docs/userflow-js).

## TypeScript support

This package contains TypeScript definitions of the `userflow` object. `loadUserflow` returns `Promise<Userflow>`.
