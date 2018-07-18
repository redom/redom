import { createElement } from './create-element.js';
import { parseArguments, isString, isNode, isFunction, getEl } from './util.js';

const htmlCache = {};

const memoizeHTML = query => htmlCache[query] || (htmlCache[query] = createElement(query));

export const html = (query, ...args) => {
  let element;

  if (isString(query)) {
    element = memoizeHTML(query).cloneNode(false);
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

html.extend = function (query, ...args) {
  const clone = memoizeHTML(query);

  return html.bind(this, clone, ...args);
};

export const el = html;
export const h = html;
