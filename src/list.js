import { el } from './el';
import { setChildren } from './setchildren';

export function list (parent, View, key, initData) {
  return new List(parent, View, key, initData);
}

export function List(parent, View, key, initData) {
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
}

list.extend = List.extend;

List.prototype.update = function (data) {
  var View = this.View;
  var key = this.key;
  var initData = this.initData;
  var views = this.views;
  var parent = this.el;
  var traverse = parent.firstChild;

  if (key) {
    var lookup = this.lookup;
  }

  for (var i = 0; i < data.length; i++) {
    var item = data[i];
    if (key) {
      var id = typeof key === 'function' ? key(item) : item[key];
      var view = views[i] = lookup[id] || (lookup[id] = new View(initData, item, i));
      view.__id = id;
    } else {
      var view = views[i] || (views[i] = new View(initData, item, i));
    }
    var el = view.el;
    view.el = el;
    el.__redom_view = view;
    view.update && view.update(item);

    if (traverse === el) {
      traverse = traverse.nextSibling;
      continue;
    }
    if (traverse) {
      parent.insertBefore(el, traverse);
    } else {
      parent.appendChild(el);
    }
    if (view.isMounted) {
      view.remounted && view.remounted();
    } else {
      view.isMounted = true;
      view.mounted && view.mounted();
    }
  }

  while (traverse) {
    var next = traverse.nextSibling;

    if (key) {
      var view = traverse.__redom_view;
      if (view) {
        var id = view.__id;
        lookup[id] = null;
      }
    }
    views[i++] = null;
    parent.removeChild(traverse);

    traverse = next;
  }

  views.length = data.length;
}
