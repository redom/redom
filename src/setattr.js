import { setStyle } from './setstyle';
import { isFunction } from './util';

export function setAttr (view, arg1, arg2) {
  const el = view.el || view;
  let isSVG = el instanceof window.SVGElement;

  if (arguments.length > 2) {
    if (arg1 === 'style') {
      setStyle(el, arg2);
    } else if (isSVG && isFunction(arg2)) {
      el[arg1] = arg2;
    } else if (!isSVG && (arg1 in el || isFunction(arg2))) {
      el[arg1] = arg2;
    } else {
      el.setAttribute(arg1, arg2);
    }
  } else {
    for (const key in arg1) {
      setAttr(el, key, arg1[key]);
    }
  }
}
