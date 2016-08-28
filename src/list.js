import { setChildren } from './children';

export function list (el, factory, keyResolver) {
  el.lookup = {};

  el.update = function (data) {
    var lookup = el.lookup;
    var newLookup = {};
    var views = [];

    for (var i = 0; i < data.length; i++) {
      var item = data[i];

      if (keyResolver) {
        var id = keyResolver(item);
      } else {
        var id = i;
      }

      var view = newLookup[id] = lookup[id] || (newLookup[id] = factory(item, i));
      view && view.update(item);
      views.push(view);
    }
    setChildren(el, views);
    el.lookup = newLookup;
  }
  return el;
}
