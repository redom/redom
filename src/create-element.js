const HASH = '#';
const DOT = '.';

export function createElement (query, ns) {
  let tag;
  let id;
  let className;

  let mode = 0;
  let start = 0;
  const len = query.length;

  for (let i = 0; i <= len; i++) {
    const char = query[i];

    if (char === HASH || char === DOT || char == null) {
      if (mode === 0) {
        if (i === 0) {
          tag = 'div';
        } else if (char == null) {
          tag = query;
        } else {
          tag = query.substring(start, i);
        }
      } else {
        const slice = query.substring(start, i);

        if (mode === 1) {
          id = slice;
        } else if (className) {
          className += ' ' + slice;
        } else {
          className = slice;
        }
      }

      start = i + 1;

      if (char === HASH) {
        mode = 1;
      } else {
        mode = 2;
      }
    }
  }

  const element = ns ? document.createElementNS(ns, tag) : document.createElement(tag);

  if (id) {
    element.id = id;
  }

  if (className) {
    element.className = className;
  }

  return element;
}
