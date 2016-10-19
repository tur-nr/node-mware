# mware

`mware` is a utility for creating a middleware stack with any node or browser application. Inspired by the middleware pattern in [connect](https://github.com/senchalabs/connect).

[![Build Status](https://travis-ci.org/tur-nr/node-mware.svg?branch=master)](https://travis-ci.org/tur-nr/node-mware) [![Coverage Status](https://coveralls.io/repos/github/tur-nr/node-mware/badge.svg?branch=master)](https://coveralls.io/github/tur-nr/node-mware?branch=master)

### Usage

```js
import mware from 'mware';
const { use, run } = mware();

// add middleware
use((ctx, next) => {
    console.assert(ctx === context);

    return next();                     // next middleware
    return next(null, true);           // stop the stack
    return next(new Error('oopsies')); // stop and report error
});

// run stack
const context = {};
run([context], (err) => {
    if (err) throw err;
    console.log('stack complete');
});
```

## Installation

#### NPM

```
npm install --save mware
```

#### Yarn

```
yarn add mware
```

## API

##### `mware()`
Returns a `mware` instance.

#### Instance

##### `#use(fn...)`
* `fn: Function|[]Function`, Middleware functions to add to stack.

##### `#run([args], [done])`
* `args: []*`, List of arguments to pass to each middleware function.
* `done: Function`, Callback for when the middleware stack has stopped.

## License

[MIT](LICENSE)

Copyright (c) 2016 [Christopher Turner](https://github.com/tur-nr)
