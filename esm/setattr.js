/* global SVGElement */

import { setStyle } from './setstyle.js';
import { isFunction, getEl } from './util.js';

const xlinkns = 'http://www.w3.org/1999/xlink';

export const setAttr = (view, arg1, arg2) => {
  const el = getEl(view);
  let isSVG = el instanceof SVGElement;

  if (arg2 !== undefined) {
    if (arg1 === 'style') {
      setStyle(el, arg2);
    } else if (isSVG && isFunction(arg2)) {
      el[arg1] = arg2;
    } else if (arg1 === 'dataset') {
      setData(el, arg2);
    } else if (!isSVG && (arg1 in el || isFunction(arg2))) {
      el[arg1] = arg2;
    } else {
      if (isSVG && (arg1 === 'xlink')) {
        setXlink(el, arg2);
        return;
      }
      el.setAttribute(arg1, arg2);
    }
  } else {
    for (const key in arg1) {
      setAttr(el, key, arg1[key]);
    }
  }
};

function setXlink (el, obj) {
  for (const key in obj) {
    el.setAttributeNS(xlinkns, key, obj[key]);
  }
}

function setData (el, obj) {
  for (const key in obj) {
    el.dataset[key] = obj[key];
  }
}
