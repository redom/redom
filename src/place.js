import { text } from './text';
import { mount, unmount } from './mount';
import { getEl } from './util';

export const place = (View, initData) => {
  return new Place(View, initData);
};

export class Place {
  constructor (View, initData) {
    this.el = text('');
    this._placeholder = this.el;
    this._visible = false;
    this._View = View;
    this._initData = initData;
  }
  update (visible, data) {
    if (visible) {
      if (!this._visible) {
        const placeholder = this._placeholder;
        const parentNode = placeholder.parentNode;
        const View = this._View;
        const view = new View(this._initData);

        this.el = getEl(view.el);
        this._view = view;

        mount(parentNode, this.el, placeholder);
        unmount(parentNode, placeholder);
      }
      this._view.update && this._view.update(data);
    } else {
      if (this._visible) {
        const placeholder = this._placeholder;
        const parentNode = this.el.parentNode;

        mount(parentNode, placeholder, this.el);
        unmount(parentNode, this.el);

        this.el = placeholder;
      }
    }
    this._visible = visible;
  }
}
