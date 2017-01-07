import { createElement } from './create-element';
import { mount } from './mount';
import { text } from './text';
import { setAttr } from './el';

const SVG = 'http://www.w3.org/2000/svg';

const svgcache = {};

export function svg (query, a) {
  let element;

  if (typeof query === 'string') {
    element = (svgcache[query] || (svgcache[query] = createElement(query, SVG))).cloneNode(false);
  } else if (query && query.nodeType) {
    element = query.cloneNode(false);
  } else {
    throw new Error('At least one argument required');
  }

  let empty = true;

  for (let i = 1; i < arguments.length; i++) {
    let arg = arguments[i];

    if (!arg) {
      continue;
    } else if (typeof arg === 'function') {
      arg = arg(element);
    } else if (typeof arg === 'string' || typeof arg === 'number') {
      if (empty) {
        empty = false;
        element.textContent = arg;
      } else {
        element.appendChild(text(arg));
      }
    } else if (arg.nodeType || (arg.el && arg.el.nodeType)) {
      empty = false;
      mount(element, arg);
    } else if (typeof arg === 'object') {
      setAttr(element, arg);
    }
  }

  return element;
}

svg.extend = function (query) {
  const clone = (svgcache[query] || (svgcache[query] = createElement(query, SVG)));

  return svg.bind(this, clone);
};
