export default () => {
    const stack = [];
    const use = (...fns) => {
        let i = fns.length;
        while (i--) {
            const fn = fns[i];
            if (Array.isArray(fn)) return use(...fn);
            if ('function' === typeof fn) stack.unshift(fn);
        }
    }
    const run = (args, done) => {
        let i = stack.length;
        const next = (err=null, fin) => {
            if (err || fin || !i) {
                if ('function' === typeof done) done(err);
                return;
            }
            stack[--i].apply(null, [...args, next]);
        }
        next();
    }
    return { use, run };
};
