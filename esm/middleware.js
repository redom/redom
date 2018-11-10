import { mwFuncs } from './util';

export const use = (...funcs) => {
    for (let func of funcs) {
        if (typeof func !== 'function') {
            throw new TypeError('expected a function');
        }
    }

    mwFuncs.push(...funcs);
};