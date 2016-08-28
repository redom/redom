export function update (handler) {
  return function (el) {
    if (el.update) {
      var originalUpdate = el.update;
      el.update = function (data) {
        handler(el, data);
        originalUpdate(el, data);
      }
    } else {
      el.update = function (data) {
        handler(el, data);
      }
    }
  }
}
