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
        const parentNode = this._placeholder.parentNode;
        const View = this._View;
        const view = new View(this._initData);

        this.el = getEl(view.el);
        this._view = view;

        mount(parentNode, this.el, this._placeholder);
        unmount(parentNode, this._placeholder);
      }
      this._view.update && this._view.update(data);
    } else {
      if (this._visible) {
        const parentNode = this.el.parentNode;

        mount(parentNode, this._placeholder, this.el);
        unmount(parentNode, this.el);

        this.el = this._placeholder;
      }
    }
    this._visible = visible;
  }
}
