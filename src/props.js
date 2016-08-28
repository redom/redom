export function props (_props) {
  return function (el) {
    for (var key in _props) {
      el[key] = _props[key];
    }
  }
}

export function setProps (el, _props) {
  return props(_props)(el);
}
