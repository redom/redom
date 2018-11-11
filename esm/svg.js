import { createElement } from './create-element.js';
import _parseArguments from './util/_parseArguments.js';
import _isNode from './util/_isNode.js';
import _getEl from './util/_getEl.js';

const ns = 'http://www.w3.org/2000/svg';

const svgCache = {};

const memoizeSVG = (query) => svgCache[query] || (svgCache[query] = createElement(query, ns));

export const svg = (query, ...args) => {
  let element;

  let type = typeof query;

  if (type === 'string') {
    element = memoizeSVG(query).cloneNode(false);
  } else if (_isNode(query)) {
    element = query.cloneNode(false);
  } else if (type === 'function') {
    const Query = query;
    element = new Query(...args);
  } else {
    throw new Error('At least one argument required');
  }

  _parseArguments(_getEl(element), args);

  return element;
};

svg.extend = (query) => {
  return svg.bind(svg, memoizeSVG(query));
};

svg.ns = ns;

export const s = svg;
