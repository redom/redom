import { createElement } from './create-element.js';
import { parseArgumentsInternal, isNode, getEl } from './util.js';

const ns = 'http://www.w3.org/2000/svg';

const svgCache = {};

export function svg (query, ...args) {
  let element;

  const type = typeof query;

  if (type === 'string') {
    element = memoizeSVG(query).cloneNode(false);
  } else if (isNode(query)) {
    element = query.cloneNode(false);
  } else if (type === 'function') {
    const Query = query;
    element = new Query(...args);
  } else {
    throw new Error('At least one argument required');
  }

  parseArgumentsInternal(getEl(element), args, true);

  return element;
}

export const s = svg;

svg.extend = function extendSvg (query) {
  const clone = memoizeSVG(query);

  return svg.bind(this, clone);
};

svg.ns = ns;

function memoizeSVG (query) {
  return svgCache[query] || (svgCache[query] = createElement(query, ns));
}
