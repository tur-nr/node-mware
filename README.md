# mware

mware is a utility for creating middleware paradigms with any node or browser application. Inspired by the middleware pattern in [connect](https://github.com/senchalabs/connect).

[![Build Status](https://travis-ci.org/tur-nr/node-mware?branch=master)](https://travis-ci.org/tur-nr/node-mware)

### Example

```js
var use = require('mware')();
var message = {};

use(function(msg, next) {
  // msg === message
  next();
});

use.run(message, function(err) {
  if (err) return console.log(err);
  // finished
});
```

## Installation

### Node

To install mware in a Node application use npm.

```bash
npm install mware
```

### Browser

No tests available for the browser but you may try using it via [webpack](https://github.com/webpack/webpack).

```bash
webpack index.js mware.js
```

## Test

To run tests use the npm.

```bash
npm install
npm test
```

## Documentation

todo

## License

[MIT](LICENSE)

Copyright (c) 2014 [Christopher Turner](https://github.com/tur-nr)