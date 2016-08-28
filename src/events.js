export function events (_events) {
  return function (el) {
    for (var key in _events) {
      el[key] = function (e) {
        _events[key](el, e);
      }
    }
  }
}
