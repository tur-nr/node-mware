var slice = require('sliced');

module.exports = function mware(context) {
  if (typeof context !== 'object') {
    context = null;
  }
  
  return (function() {
    var calls = [];

    function use() {
      var args = slice(arguments);

      while (args.length) {
        var call = args.shift();

        if (Array.isArray(call)) {
          use.apply(this, call);
          continue;
        }

        if (typeof call !== 'function') {
          throw new TypeError();
        }

        calls.push(call);
      }

      return context;
    }

    use.run = function run() {
      var args = slice(arguments)
        , stack = calls.concat()
        , done;

      if (typeof args[args.length - 1] === 'function') {
        done = args.pop();
      }

      if (!stack.length) {
        return done();
      }

      args.push(next);

      function exec() {
        stack.shift().apply(context, args);
      }

      function next(err, fin) {
        if (err || fin || !stack.length) {
          stack = null;
          if (done) { done(err) };
          return;
        }
        
        exec();
      }

      exec();
    };

    return use;
  }());
};