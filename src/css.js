const attached = {};
const memoized = {};
let style = {};

document && (style = document.createElement('p').style);

export const css = (obj, key) => {
  if (key != null) {
    if (key in attached) {
      return;
    }
    attached[key] = true;
  }
  let styles = [];

  walkCSS(obj, (str) => {
    styles.push(str);
  });

  if (styles.length) {
    const style = document.createElement('style');
    style.textContent = styles.join('');
    document.head.appendChild(style);
  }
};

function walkCSS (obj, iterator, path = '', previousKey = '') {
  const values = [];
  const inner = [];
  const pushInner = (str) => inner.push(str);

  for (let key in obj) {
    const value = obj[key];

    if (typeof value === 'object') {
      if (key[0] === '@') {
        pushInner(key + '{');
        walkCSS(value, pushInner, '', key);
        pushInner('}');
      } else if (previousKey.slice(0, 10) === '@keyframes') {
        pushInner(key + '{');
        walkCSS(value, pushInner, '', key);
        pushInner('}');
      } else {
        const split = key.split(',');
        const cssKey = new Array(split.length);
        for (let i = 0; i < split.length; i++) {
          const key = split[i];
          if (key[0] === '&') {
            cssKey[i] = path + key.slice(1);
          } else {
            cssKey[i] = (path + ' ' + key).trim();
          }
        }
        walkCSS(value, pushInner, cssKey.join(','), key);
      }
    } else {
      values.push(kebabCase(prefix(key)) + ':' + value + ';');
    }
  }
  if (values.length) {
    iterator(path + '{');
    iterator(values.join(''));
    iterator('}');
  }
  if (inner.length) {
    for (let i = 0; i < inner.length; i++) {
      iterator(inner[i]);
    }
  }
}

export function prefix (param) {
  if (memoized[param] != null) {
    return memoized[param];
  }

  if (style[param] != null) {
    return (memoized[param] = param);
  }

  const camelCase = param[0].toUpperCase() + param.slice(1);
  const prefixes = ['webkit', 'moz', 'ms', 'o'];

  for (let i = 0, len = prefixes.length; i < len; i++) {
    const test = prefixes[i] + camelCase;

    if (style[test] != null) {
      return (memoized[param] = '-' + test);
    }
  }

  if (!memoized[param]) {
    return (memoized[param] = param);
  }
}

function kebabCase (source) {
  const result = [];
  for (let i = 0; i < source.length; i++) {
    const char = source[i];
    const lowerCase = char.toLowerCase();
    if (char !== lowerCase) {
      result.push('-', lowerCase);
    } else {
      result.push(char);
    }
  }
  return result.join('');
}
