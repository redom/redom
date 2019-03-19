import { parseQuery } from './parse-query.js';

export function createElement (query, ns) {
  const { tag, id, className } = parseQuery(query);
  const element = ns ? document.createElementNS(ns, tag) : document.createElement(tag);

  if (id) {
    element.id = id;
  }

  if (className) {
    if (ns) {
      element.setAttribute('class', className);
    } else {
      element.className = className;
    }
  }

  return element;
}
