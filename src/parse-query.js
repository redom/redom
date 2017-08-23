const HASH = '#'.charCodeAt(0);
const DOT = '.'.charCodeAt(0);

export const parseQuery = (query) => {
  let tag;
  let id;
  let className;

  let mode = 0;
  let start = 0;

  for (let i = 0; i <= query.length; i++) {
    const char = query.charCodeAt(i);

    if (char === HASH || char === DOT || !char) {
      if (mode === 0) {
        if (i === 0) {
          tag = 'div';
        } else if (!char) {
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

  return { tag, id, className };
};
