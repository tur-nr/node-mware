var mware = require('../')
  , assert = require('assert');

describe('mware', function() {
  describe('#use()', function() {
    it('should add middleware', function(done) {
      var use = mware();

      assert.equal(typeof use, 'function', 'use is a function');

      use(function(next) {
        assert.equal(typeof next, 'function');
        done();
      });
      use.run();
    });

    it('should add with args', function(done) {
      var use = mware();

      use(function(arg1, arg2, next) {
        assert.equal(arg1, 1);
        assert.equal(arg2, 2);
        assert.equal(typeof next, 'function');
        done();
      });
      use.run(1, 2);
    });

    it('should modify args', function(done) {
      var use = mware()
        , arg = { foo: 'bar' };

      use(function(obj, next) {
        assert.strictEqual(obj, arg);
        arg.baz = 'qux';
        next();
      });
      use(function(obj, next) {
        assert.strictEqual(obj, arg);
        assert.equal(obj.baz, 'qux');
        done();
      });
      use.run(arg);
    });

    it('should add multiple', function(done) {
      var use = mware();

      use(function(next) { next(); }
        , function(next) { done(); }
      );
      use.run();
    });

    it('should add array', function(done) {
      var use = mware();

      use([function(next) { next(); }
        , function(next) { done(); }
      ]);
      use.run();
    });

    it('should throw TypeError', function() {
      var use = mware();

      assert.throws(function() {
        use({});
      }, TypeError);
    });

    it('should have applied context', function(done) {
      var context = {};
      var use = mware(context);

      use(function(next) {
        assert.strictEqual(context, this);
        next();
      });
      use.run(function(err) {
        assert.strictEqual(context, this);
        done();
      });
    });
  });

  describe('#run()', function() {
    it('should callback done', function(done) {
      var use = mware();

      use(function(next) { next(); });

      use.run(function(err) {
        assert.equal(err, null);
        done();
      });
    });

    it('should callback done, with args', function(done) {
      var use = mware();

      use(function(arg1, arg2, next) {
        assert.equal(arg1, 1);
        assert.equal(arg2, 2);
        assert.equal(typeof next, 'function');
        next();
      });

      use.run(1, 2, function(err) {
        assert.equal(err, null);
        done();
      });
    });

    it('should stop on error', function(done) {
      var use = mware();

      use(function(next) { next(new Error()); }
        , function() { throw new Error('should never have thrown'); }
      );

      use.run(function(err) {
        assert.ok(err instanceof Error);
        done();
      });
    });

    it('should finish early', function(done) {
      var use = mware();

      use(function(next) { next(null, true); }
        , function() { throw new Error('should never have thrown'); }
      );

      use.run(function(err) {
        assert.equal(err, null);
        done();
      });
    });
  });
});