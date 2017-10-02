const HASH = '#'.charCodeAt(0);
const DOT = '.'.charCodeAt(0);

export const parseQuery = (query) => {
  let tag = null;
  let id = null;
  let className = null;
  let mode = 0;
  let buffer = '';

  for (let i = 0; i <= query.length; i++) {
    const char = query.charCodeAt(i);
    const isHash = char === HASH;
    const isDot = char === DOT;
    const isEnd = !char;

    if (isHash || isDot || isEnd) {
      if (mode === 0) {
        if (i === 0) {
          tag = 'div';
        } else {
          tag = buffer;
        }
      } else if (mode === 1) {
        id = buffer;
      } else {
        if (className) {
          className += ' ' + buffer;
        } else {
          className = buffer;
        }
      }

      if (isHash) {
        mode = 1;
      } else if (isDot) {
        mode = 2;
      }

      buffer = '';
    } else {
      buffer += query[i];
    }
  }

  return { tag, id, className };
};
