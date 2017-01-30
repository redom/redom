import { createElement } from './create-element';
import { parseArguments, isString, isNode } from './util';

const elcache = {};

const memoizeEl = query => elcache[query] || createElement(query);

export function el (query, ...args) {
  let element;

  if (isString(query)) {
    element = memoizeEl(query).cloneNode(false);
  } else if (isNode(query)) {
    element = query.cloneNode(false);
  } else {
    throw new Error('At least one argument required');
  }

  parseArguments(element, args);

  return element;
}

el.extend = function (query) {
  const clone = memoizeEl(query);

  return el.bind(this, clone);
};

export const html = el;
