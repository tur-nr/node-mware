var slice = require('sliced')
  , isval = require('isval');

module.exports = function mware(context) {
  if (!isval(context, 'object')) {
    context = null;
  }

  return (function() {
    var calls = [];

    function use() {
      var args = slice(arguments);

      while (args.length) {
        var call = args.shift();

        if (isval(call, 'array')) {
          use.apply(this, call);
          continue;
        }

        if (!isval(call, 'function')) {
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

      if (isval(args[args.length - 1], 'function')) {
        done = args.pop();
      }

      if (!stack.length) {
        if (done) { done.call(context); }
        return;
      }

      args.push(next);

      function exec() {
        stack.shift().apply(context, args);
      }

      function next(err, fin) {
        if (err || fin || !stack.length) {
          stack = null;
          if (done) { done.call(context, err); }
          return;
        }
        
        exec();
      }

      exec();
    };

    return use;
  }());
};