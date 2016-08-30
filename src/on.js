export function on (eventHandlers) {
  return function (el) {
    for (var key in eventHandlers) {
      el.addEventListener(key, function (e) {
        eventHandlers[key].call(el.view, e);
      });
    }
    return;
  }
}
