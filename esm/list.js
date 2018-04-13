import { setChildren } from './setchildren.js';
import { ensureEl } from './util.js';
import { unmount } from './unmount.js';
import { ListPool } from './listpool.js';

export const list = (parent, View, key, initData) => {
  return new List(parent, View, key, initData);
};

export class List {
  constructor (parent, View, key, initData) {
    this.__redom_list = true;
    this.View = View;
    this.initData = initData;
    this.views = [];
    this.pool = new ListPool(View, key, initData);
    this.el = ensureEl(parent);
    this.keySet = key != null;
  }
  update (data = [], context) {
    const { keySet } = this;
    const oldViews = this.views;
    const oldLookup = keySet && this.lookup;

    this.pool.update(data, context);
    const { views, lookup } = this.pool;

    if (keySet) {
      for (let i = 0; i < oldViews.length; i++) {
        const id = oldViews[i].__redom_id;
        if (!(id in lookup)) {
          unmount(this, oldLookup[id]);
        }
      }
    }

    setChildren(this, views);

    if (keySet) {
      this.lookup = lookup;
    }
    this.views = views;
  }
}

List.extend = (parent, View, key, initData) => {
  return List.bind(List, parent, View, key, initData);
};

list.extend = List.extend;
