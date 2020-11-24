import { getEl } from './util.js';

export function listPool (View, key, initData) {
  return new ListPool(View, key, initData);
}

export class ListPool {
  constructor (View, key, initData) {
    this.View = View;
    this.initData = initData;
    this.oldLookup = {};
    this.lookup = {};
    this.oldViews = [];
    this.views = [];

    if (key != null) {
      this.key = typeof key === 'function' ? key : propKey(key);
    }
  }

  update (data, context) {
    const { View, key, initData } = this;
    const keySet = key != null;

    const oldLookup = this.lookup;
    const newLookup = {};

    const newViews = Array(data.length);
    const oldViews = this.views;

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
      view.update && view.update(item, i, data, context);

      const el = getEl(view.el);

      el.__redom_view = view;
      newViews[i] = view;
    }

    this.oldViews = oldViews;
    this.views = newViews;

    this.oldLookup = oldLookup;
    this.lookup = newLookup;
  }
}

function propKey (key) {
  return function (item) {
    return item[key];
  };
}
