import { setChildren } from "./setchildren.js";
import { ensureEl } from "./util.js";
import { unmount } from "./unmount.js";
import { ListPool } from "./listpool.js";

export function list(parent, View, key, initData) {
  return new List(parent, View, key, initData);
}

export class List {
  constructor(parent, View, key, initData) {
    this.View = View;
    this.initData = initData;
    this.views = [];
    this.pool = new ListPool(View, key, initData);
    this.el = ensureEl(parent);
    this.keySet = key != null;
  }

  update(data = [], context) {
    const { keySet } = this;
    const oldViews = this.views;

    this.pool.update(data, context);

    const { views, lookup } = this.pool;

    if (keySet) {
      for (let i = 0; i < oldViews.length; i++) {
        const oldView = oldViews[i];
        const id = oldView.__redom_id;

        if (lookup[id] == null) {
          oldView.__redom_index = null;
          unmount(this, oldView);
        }
      }
    }

    for (let i = 0; i < views.length; i++) {
      const view = views[i];

      view.__redom_index = i;
    }

    setChildren(this, views);

    if (keySet) {
      this.lookup = lookup;
    }
    this.views = views;
  }
}

List.extend = function extendList(parent, View, key, initData) {
  return List.bind(List, parent, View, key, initData);
};

list.extend = List.extend;
