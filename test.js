const { merge: deepMerge } = require('lodash');
const a = {
    a: 123,
    b: {
        a: 123,
        b: 456,
        c: {
            a: 55555,
            b: 4444
        }
    }
};

const b = {
    a: 456,
    b: {
        b: 11111111,
        c: {
            a: 2222
        }
    }
};

const c = {
    a: 6666,
    b: {
        d: 5555
    }
};
const d = {
    c: 6666
};

console.log(deepMerge(a, b, c, d));
console.log(a);