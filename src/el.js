/* global SVGElement */

import { createElement } from './create-element';
import { text } from './text';
import { mount } from './mount';

const elcache = {};

export function el (query) {
  let element;

  if (typeof query === 'string') {
    element = (elcache[query] || (elcache[query] = createElement(query))).cloneNode(false);
  } else if (query && query.nodeType) {
    element = query.cloneNode(false);
  } else {
    throw new Error('At least one argument required');
  }

  let empty = true;

  for (let i = 1; i < arguments.length; i++) {
    const arg = arguments[i];

    if (!arg) {
      continue;
    }

    // support middleware
    if (typeof arg === 'function') {
      arg(element);
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
    } else if (arg.length) {
      empty = false;
      for (let j = 0; j < arg.length; j++) {
        mount(element, arg[j]);
      }
    } else if (typeof arg === 'object') {
      setAttr(element, arg);
    }
  }

  return element;
}

el.extend = function (query) {
  const clone = (elcache[query] || (elcache[query] = createElement(query)));

  return el.bind(this, clone);
};

export function setAttr (view, arg1, arg2) {
  const el = view.el || view;
  let isSVG = el instanceof SVGElement;

  if (arguments.length > 2) {
    if (arg1 === 'style') {
      setStyle(el, arg2);
    } else if (isSVG && typeof arg2 === 'function') {
      el[arg1] = arg2;
    } else if (!isSVG && (arg1 in el || typeof arg2 === 'function')) {
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

export function setStyle (view, arg1, arg2) {
  const el = view.el || view;

  if (arguments.length > 2) {
    el.style[arg1] = arg2;
  } else if (typeof arg1 === 'string') {
    el.setAttribute('style', arg1);
  } else {
    for (const key in arg1) {
      setStyle(el, key, arg1[key]);
    }
  }
}
