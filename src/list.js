import { setChildren } from './setchildren';
import { isFunction, ensureEl } from './util';

export function list (parent, View, key, initData) {
  return new List(parent, View, key, initData);
}

export function List (parent, View, key, initData) {
  this.__redom_list = true;
  this.View = View;
  this.key = key;
  this.initData = initData;
  this.views = [];
  this.el = ensureEl(parent);

  if (key) {
    this.lookup = {};
  }
}

List.extend = function (parent, View, key, initData) {
  return List.bind(List, parent, View, key, initData);
};

list.extend = List.extend;

List.prototype.update = function (data = []) {
  const View = this.View;
  const key = this.key;
  const functionKey = isFunction(key);
  const initData = this.initData;
  const newViews = new Array(data.length);
  const oldViews = this.views;
  const newLookup = key && {};
  const oldLookup = key && this.lookup;

  for (let i = 0; i < data.length; i++) {
    const item = data[i];
    let view;

    if (key) {
      const id = functionKey ? key(item) : item[key];
      view = newViews[i] = oldLookup[id] || new View(initData, item, i, data);
      newLookup[id] = view;
      view.__id = id;
    } else {
      view = newViews[i] = oldViews[i] || new View(initData, item, i, data);
    }
    let el = view.el;
    if (el.__redom_list) {
      el = el.el;
    }
    el.__redom_view = view;
    view.update && view.update(item, i, data);
  }

  setChildren(this, newViews);

  if (key) {
    this.lookup = newLookup;
  }
  this.views = newViews;
};
