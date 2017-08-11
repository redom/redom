import { createElement } from './create-element';
import { parseArguments, isString, isNode } from './util';

const htmlCache = {};

const memoizeHTML = query => htmlCache[query] || (htmlCache[query] = createElement(query));

export const html = (query, ...args) => {
  let element;

  if (isString(query)) {
    element = memoizeHTML(query).cloneNode(false);
  } else if (isNode(query)) {
    element = query.cloneNode(false);
  } else {
    throw new Error('At least one argument required');
  }

  parseArguments(element, args);

  return element;
};

html.extend = function (query) {
  const clone = memoizeHTML(query);

  return html.bind(this, clone);
};

export const el = html;
