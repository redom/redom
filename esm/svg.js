import { createElement } from './create-element.js';
import { parseArguments, isNode, getEl } from './util.js';

const ns = 'http://www.w3.org/2000/svg';

const svgCache = {};

const memoizeSVG = (query) => svgCache[query] || (svgCache[query] = createElement(query, ns));

export const svg = (query, ...args) => {
  let element;

  let type = typeof query;

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

  parseArguments(getEl(element), args);

  return element;
};

svg.extend = (query) => {
  return svg.bind(svg, memoizeSVG(query));
};

svg.ns = ns;

export const s = svg;
