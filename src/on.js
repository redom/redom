export function on (eventHandlers) {
  return function (el) {
    for (var key in eventHandlers) {
      addHandler(el, key, eventHandlers[key]);
    }
    return;
  }
}

function addHandler (el, key, handler) {
  el.addEventListener(key, function (e) {
    handler.call(el.view, e);
  });
}
