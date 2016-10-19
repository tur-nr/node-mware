import test from 'ava';
import sinon from 'sinon';
import mware from '../src';

test('exports mware factory', (t) => {
    t.is(typeof mware, 'function');
});

test('has use method', (t) => {
    const m = mware();
    t.is(typeof m.use, 'function');
});

test('has run method', (t) => {
    const m = mware();
    t.is(typeof m.run, 'function');
});

test('calls done with no middleware', (t) => {
    const m = mware();
    const done = sinon.stub();
    m.run([], done);
    t.truthy(done.calledWith(null));
});

test('calls added middleware', (t) => {
    const m = mware();
    const fn = sinon.stub().yields();
    m.use(fn);
    m.run([]);
    t.truthy(fn.calledWithMatch(
        sinon.match.func
    ));
});

test('adds array of middleware', (t) => {
    const m = mware();
    const fn = sinon.stub().yields();
    m.use([fn, fn, fn]);
    m.run([]);
    t.truthy(fn.calledThrice);
});

test('adds only functions as middleware', (t) => {
    const m = mware();
    const fn = sinon.stub().yields();
    m.use([fn, null, fn]);
    m.run([]);
    t.truthy(fn.calledTwice);
});

test('calls done after stack finished', (t) => {
    const m = mware();
    const fn = sinon.stub().yields();
    const done = sinon.stub();
    m.use(fn);
    m.run([], done);
    t.truthy(done.calledWith(null));
});

test('passes arguments to middleware', (t) => {
    const m = mware();
    const fn = sinon.stub().yields();
    const done = sinon.stub();
    const object = {};
    m.use(fn);
    m.run([object, true, 'foo'], done);
    t.truthy(fn.calledWithMatch(
        sinon.match.same(object),
        sinon.match(true),
        sinon.match('foo'),
        sinon.match.func
    ));
});