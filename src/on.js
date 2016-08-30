import { createElementCurry } from './curry';

export var on = createElementCurry(function (el, event, callback) {
  el.addEventListener(event, function (e) {
    callback.call(el.view, e);
  });
});
