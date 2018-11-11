import { createElement } from './create-element.js';
import _parseArguments from './util/_parseArguments.js';
import _isNode from './util/_isNode.js';
import _getEl from './util/_getEl.js';

const htmlCache = {};

const memoizeHTML = (query) => htmlCache[query] || (htmlCache[query] = createElement(query));

export const html = (query, ...args) => {
  let element;

  let type = typeof query;

  if (type === 'string') {
    element = memoizeHTML(query).cloneNode(false);
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

html.extend = (query, ...args) => {
  return html.bind(html, memoizeHTML(query), ...args);
};

export const el = html;
export const h = html;
