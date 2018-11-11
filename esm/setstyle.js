import _getEl from './util/_getEl';

export const setStyle = (view, arg1, arg2) => {
  const el = _getEl(view);

  if (arg2 !== undefined) {
    el.style[arg1] = arg2;
  } else if (typeof arg1 === 'string') {
    el.setAttribute('style', arg1);
  } else {
    for (const key in arg1) {
      setStyle(el, key, arg1[key]);
    }
  }
};
