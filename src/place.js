import { text } from './text';
import { mount } from './mount';
import { unmount } from './unmount';
import { getEl } from './util';

export const place = (View, initData) => {
  return new Place(View, initData);
};

export class Place {
  constructor (View, initData) {
    this.el = text('');
    this.visible = false;
    this.view = null;
    this._placeholder = this.el;
    this._View = View;
    this._initData = initData;
  }
  update (visible, data) {
    const placeholder = this._placeholder;
    const parentNode = this.el.parentNode;

    if (visible) {
      if (!this.visible) {
        const View = this._View;
        const view = new View(this._initData);

        this.el = getEl(view.el);
        this.view = view;

        mount(parentNode, view, placeholder);
        unmount(parentNode, placeholder);
      }
      this.view.update && this.view.update(data);
    } else {
      if (this.visible) {
        mount(parentNode, placeholder, this.view);
        unmount(parentNode, this.view);

        this.el = placeholder;
        this.view = null;
      }
    }
    this.visible = visible;
  }
}
