import { isString, getEl } from './util.js';

export const setStyle = (view, arg1, arg2) => {
  const el = getEl(view);

  if (arg2 !== undefined) {
    el.style[arg1] = arg2;
  } else if (isString(arg1)) {
    el.setAttribute('style', arg1);
  } else {
    for (const key in arg1) {
      setStyle(el, key, arg1[key]);
    }
  }
};
