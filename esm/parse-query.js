export function parseQuery(query) {
  let isId = false, isClass = false , tag = '', id = '', className = '';
  [...query].forEach(char => {
      switch (char) {
          case '.':
              isClass = true;
              isId = false;
              className = className.length > 0 ? (className + ' ') : className;
              if (char !== '.') {
                  className += char;
                }
              break;
          case '#': 
              isId = true;
              isClass = false;
              break;
          default:
                if(isId && !isClass) {
                    id += char;
                }
                if(isClass && !isId) {
                    className += char;
                }
                if (!isId && !isClass) {
                  tag += char;
                }
              break;
      }
  });
  return {
      tag: tag || 'div',
      id,
      className
    };
}