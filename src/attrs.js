export function attrs (_attrs) {
  return function (el) {
    for (var key in _attrs) {
      el.setAttribute(key, _attrs[key]);
    }
  }
}

export function setAttrs (el, _attrs) {
  return attrs(_attrs)(el);
}
