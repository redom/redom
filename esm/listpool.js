import { getEl } from './util.js';

export function listPool (View, key, initData) {
  return new ListPool(View, key, initData);
}

export class ListPool {
  constructor (View, key, initData, functional) {
    this.View = View;
    this.initData = initData;
    this.oldLookup = {};
    this.lookup = {};
    this.oldViews = [];
    this.views = [];
    this.functional = functional;

    if (key != null) {
      this.key = typeof key === 'function' ? key : propKey(key);
    }
  }
  update (data, context) {
    const { View, key, initData } = this;
    const keySet = key != null;

    const oldLookup = this.lookup;
    const newLookup = {};

    const newViews = new Array(data.length);
    const oldViews = this.views;

    for (let i = 0; i < data.length; i++) {
      const item = data[i];
      let view;
      let id;

      if (keySet) {
        id = key(item);
        view = oldLookup[id];
      } else {
        view = oldViews[i];
      }

      if (!view) {
        view = (this.functional) ? View(initData, item, i, data) : new View(initData, item, i, data);
      }

      if (id != null) {
        newLookup[id] = view;
        view.__redom_id = id;
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
