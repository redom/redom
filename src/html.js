import { createElement } from './create-element';
import { parseArguments, isString, isNode, isFunction, getEl } from './util';

const htmlCache = {};

const memoizeHTML = query => htmlCache[query] || (htmlCache[query] = createElement(query));

export const html = (query, ...args) => {
  let element;

  if (isString(query)) {
    element = memoizeHTML(query).cloneNode(false);
  } else if (isNode(query)) {
    element = query.cloneNode(false);
  } else if (isFunction(query)) {
    element = new query(...args);
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
