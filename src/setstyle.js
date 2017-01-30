import { isString } from './util';

export function setStyle (view, arg1, arg2) {
  const el = view.el || view;

  if (arguments.length > 2) {
    el.style[arg1] = arg2;
  } else if (isString(arg1)) {
    el.setAttribute('style', arg1);
  } else {
    for (const key in arg1) {
      setStyle(el, key, arg1[key]);
    }
  }
}
