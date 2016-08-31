
import { setChildren } from './setchildren';

export function list (View, key, initData) {
  return new List(View, key, initData);
}

export function List(View, key, initData) {
  this.View = View;
  this.key = key;
  this.initData = initData;
  this.views = [];

  if (key) {
    this.lookup = {};
  }
}

List.prototype.update = function (data) {
  var View = this.View;
  var key = this.key;
  var initData = this.initData;
  var views = this.views;
  var parent = this.parent;

  if (key) {
    var lookup = this.lookup;

    for (var i = 0; i < data.length; i++) {
      var item = data[i];
      var id = typeof key === 'function' ? key(item) : item[key];
      var view = lookup[id] || (lookup[id] = new View(initData, item, i));

      view.update && view.update(item);

      views[i] = view;
      lookup[id] = view;
    }
    for (var i = data.length; i < views.length; i++) {
      var id = typeof key === 'function' ? key(item) : item[key];

      lookup[id] = null;
      views[i] = null;
    }
  } else {
    for (var i = 0; i < data.length; i++) {
      var item = data[i];
      var view = views[i] || (views[i] = new View(initData, item, i));
      view.update && view.update(item);
    }
    for (var i = data.length; i < views.length; i++) {
      views[i] = null;
    }
  }

  views.length = data.length;

  parent && setChildren(parent, views);
}
