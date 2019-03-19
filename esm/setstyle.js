import { getEl } from './util.js';

export function setStyle (view, arg1, arg2) {
  const el = getEl(view);

  if (typeof arg1 === 'object') {
    for (const key in arg1) {
      setStyleValue(el, key, arg1[key]);
    }
  } else {
    setStyleValue(el, arg1, arg2);
  }
}

function setStyleValue (el, key, value) {
  if (value == null) {
    el.style[key] = '';
  } else {
    el.style[key] = value;
  }
}
