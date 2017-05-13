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

  if (!styles.length) {
    return;
  }
  const style = document.createElement('style');
  style.textContent = styles.join('');
  document.head.appendChild(style);
};

function walkCSS (obj, iterator, path = []) {
  const keys = Object.keys(obj);

  for (let i = 0; i < keys.length; i++) {
    const key = keys[i];
    const keySplit = key.split(',');
    const value = obj[key];

    if (typeof value === 'object') {
      keySplit.map(key => key.trim()).map(key => {
        if (key[0] === '&') {
          walkCSS(value, iterator, path.concat(key.slice(1)));
        } else {
          walkCSS(value, iterator, path.length ? path.concat(' ', key) : [key]);
        }
      });
    } else if (value != null) {
      iterator(path.join('') + '{' + kebabCase(prefix(key)) + ':' + value + ';}');
    }
  }
}

function prefix (param) {
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
