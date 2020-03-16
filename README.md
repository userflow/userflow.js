# Userflow.js

Simple Userflow.js installation via npm. Suitable for modern web apps that use build systems such as Webpack, Browserify, Grunt etc.

Userflow.js lives on our CDN at: https://js.getuserflow.com/userflow.js

This module exports an object that wraps all Userflow.js methods. The Userflow.js script is automatically injected into the current page when a method is called. Method calls are queued if Userflow.js is not loaded yet.

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

You can find your Userflow Token in Userflow under [Settings](https://getuserflow.com/app/_/settings).

Check out the [installation instructions](https://getuserflow.com/docs/userflow-js-installation) for more info.

## API Reference

See the [Userflow.js API Reference](https://getuserflow.com/docs/userflow-js).

## Importing userflow.js in multiple modules

You can import `userflow` in multiple files in your app. It will always refer to the same instance. The Userflow.js script will only be loaded once.

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
