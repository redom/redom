import { el } from './el';
import { setChildren } from './setchildren';

export function list (parent, View, key, initData) {
  return new List(parent, View, key, initData);
}

export function List (parent, View, key, initData) {
  this.__redom_list = true;
  this.View = View;
  this.key = key;
  this.initData = initData;
  this.views = [];
  this.el = typeof parent === 'string' ? el(parent) : parent;

  if (key) {
    this.lookup = {};
  }
}

List.extend = function (parent, View, key, initData) {
  return List.bind(List, parent, View, key, initData);
};

list.extend = List.extend;

List.prototype.update = function (data) {
  const View = this.View;
  const key = this.key;
  const functionKey = typeof key === 'function';
  const initData = this.initData;
  const views = this.views;
  const newLookup = key && {};
  const oldLookup = key && this.lookup;

  for (let i = 0; i < data.length; i++) {
    const item = data[i];
    let view;

    if (key) {
      const id = functionKey ? key(item) : item[key];
      view = views[i] = oldLookup[id] || new View(initData, item, i, data);
      newLookup[id] = view;
      view.__id = id;
    } else {
      view = views[i] || (views[i] = new View(initData, item, i, data));
    }
    let el = view.el;
    if (el.__redom_list) {
      el = el.el;
    }
    el.__redom_view = view;
    view.update && view.update(item, i, data);
  }

  views.length = data.length;

  setChildren(this.el, views);

  if (key) {
    this.lookup = newLookup;
  }
};
