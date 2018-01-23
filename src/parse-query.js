const HASH = '#'.charCodeAt(0);
const DOT = '.'.charCodeAt(0);

const TAG_NAME = 0;
const ID = 1;
const CLASS_NAME = 2;

export const parseQuery = (query) => {
  let tag = null;
  let id = null;
  let className = null;
  let mode = TAG_NAME;
  let offset = 0;

  for (let i = 0; i <= query.length; i++) {
    const char = query.charCodeAt(i);
    const isHash = char === HASH;
    const isDot = char === DOT;
    const isEnd = !char;

    if (isHash || isDot || isEnd) {
      if (mode === TAG_NAME) {
        if (i === 0) {
          tag = 'div';
        } else {
          tag = query.substring(offset, i);
        }
      } else if (mode === ID) {
        id = query.substring(offset, i);
      } else {
        if (className) {
          className += ' ' + query.substring(offset, i);
        } else {
          className = query.substring(offset, i);
        }
      }

      if (isHash) {
        mode = ID;
      } else if (isDot) {
        mode = CLASS_NAME;
      }

      offset = i + 1;
    }
  }

  return { tag, id, className };
};
