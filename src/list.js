import { setChildren } from './setchildren';
import { isFunction, ensureEl, getEl } from './util';
import { unmount } from './mount';

const propKey = key => item => item[key];

export const list = (parent, View, key, initData) => {
  return new List(parent, View, key, initData);
};

export class List {
  constructor (parent, View, key, initData) {
    this.__redom_list = true;
    this.View = View;
    this.initData = initData;
    this.views = [];
    this.el = ensureEl(parent);

    if (key != null) {
      this.lookup = {};
      this.key = isFunction(key) ? key : propKey(key);
    }
  }
  update (data = [], context) {
    const View = this.View;
    const key = this.key;
    const keySet = key != null;
    const initData = this.initData;
    const newViews = new Array(data.length);
    const oldViews = this.views;
    const newLookup = key && {};
    const oldLookup = key && this.lookup;

    for (let i = 0; i < data.length; i++) {
      const item = data[i];
      let view;

      if (keySet) {
        const id = key(item);
        view = oldLookup[id] || new View(initData, item, i, data);
        newLookup[id] = view;
        view.__redom_id = id;
      } else {
        view = oldViews[i] || new View(initData, item, i, data);
      }
      newViews[i] = view;
      let el = getEl(view.el);
      el.__redom_view = view;
      view.update && view.update(item, i, data, context);
    }

    if (keySet) {
      for (let i = 0; i < oldViews.length; i++) {
        const id = oldViews[i].__redom_id;
        if (!(id in newLookup)) {
          unmount(this, oldLookup[id]);
        }
      }
    }

    setChildren(this, newViews);

    if (keySet) {
      this.lookup = newLookup;
    }
    this.views = newViews;
  }
}

List.extend = (parent, View, key, initData) => {
  return List.bind(List, parent, View, key, initData);
};

list.extend = List.extend;
