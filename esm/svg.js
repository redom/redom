import { createElement } from './create-element.js';
import { parseArguments, isString, isNode, isFunction, getEl } from './util.js';

const ns = 'http://www.w3.org/2000/svg';

const svgCache = {};

const memoizeSVG = query => svgCache[query] || (svgCache[query] = createElement(query, ns));

export const svg = (query, ...args) => {
  let element;

  if (isString(query)) {
    element = memoizeSVG(query).cloneNode(false);
  } else if (isNode(query)) {
    element = query.cloneNode(false);
  } else if (isFunction(query)) {
    const Query = query;
    element = new Query(...args);
  } else {
    throw new Error('At least one argument required');
  }

  parseArguments(getEl(element), args);

  return element;
};

svg.extend = function (query) {
  const clone = memoizeSVG(query);

  return svg.bind(this, clone);
};

svg.ns = ns;

export const s = svg;
