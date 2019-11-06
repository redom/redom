import { createElement } from './create-element.js';
import { parseArgumentsInternal, isNode, getEl } from './util.js';

const htmlCache = {};

export function html (query, ...args) {
  let element;

  const type = typeof query;

  if (type === 'string') {
    element = memoizeHTML(query).cloneNode(false);
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

export const el = html;
export const h = html;

html.extend = function extendHtml (query, ...args) {
  const clone = memoizeHTML(query);

  return html.bind(this, clone, ...args);
};

function memoizeHTML (query) {
  return htmlCache[query] || (htmlCache[query] = createElement(query));
}
