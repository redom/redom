
import { mount } from './mount';

export function View () {}

View.prototype.on = function (type, handler) {
  this.el.addEventListener(type, function (e) {
    handler(e.detail, e);
  });
}

View.prototype.dispatch = function (type, data) {
  this.el.dispatchEvent(new CustomEvent(type, {
    bubbles: true,
    cancelable: true,
    detail: data
  }));
}

View.prototype.mount = function (parent) {
  mount(parent, this);
}
