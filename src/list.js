import { el } from './el'

export function list (parent, View, key, initData) {
  return new List(parent, View, key, initData)
}

export function List (parent, View, key, initData) {
  this.__redom_list = true
  this.View = View
  this.key = key
  this.initData = initData
  this.views = []
  this.el = typeof parent === 'string' ? el(parent) : parent

  if (key) {
    this.lookup = {}
  }
}

List.extend = function (parent, View, key, initData) {
  return List.bind(List, parent, View, key, initData)
}

list.extend = List.extend

List.prototype.update = function (data) {
  var View = this.View
  var key = this.key
  var functionKey = typeof key === 'function'
  var initData = this.initData
  var views = this.views
  var parent = this.el
  var traverse = parent.firstChild

  if (key) {
    var lookup = this.lookup
  }

  for (var i = 0; i < data.length; i++) {
    var item = data[i]
    var view

    if (key) {
      var id = functionKey ? key(item) : item[key]
      view = views[i] = lookup[id] || (lookup[id] = new View(initData, item, i, data))
      view.__id = id
    } else {
      view = views[i] || (views[i] = new View(initData, item, i, data))
    }
    var el = view.el
    if (el.__redom_list) {
      el = el.el
    }
    el.__redom_view = view
    view.update && view.update(item, i, data)

    if (traverse === el) {
      traverse = traverse.nextSibling
      continue
    }

    if (traverse) {
      parent.insertBefore(el, traverse)
    } else {
      parent.appendChild(el)
    }
    if (view.isMounted) {
      view.remounted && view.remounted()
    } else {
      view.isMounted = true
      view.mounted && view.mounted()
    }
  }

  while (traverse) {
    var next = traverse.nextSibling
    var _view = traverse.__redom_view

    if (key) {
      if (_view) {
        id = _view.__id
        lookup[id] = null
      }
    }
    views[i++] = null
    parent.removeChild(traverse)

    _view.isMounted = false
    _view.unmounted && _view.unmounted()
    traverse.__redom_view = null

    traverse = next
  }

  views.length = data.length
}
