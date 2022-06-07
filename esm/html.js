import { createElement } from './create-element.js';
import { parseArgumentsInternal, getEl } from './util.js';

export function html (query, ...args) {
  let element;

  const type = typeof query;

  if (type === 'string') {
    element = createElement(query);
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

html.extend = function extendHtml (...args) {
  return html.bind(this, ...args);
};
