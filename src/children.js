export function children (handler) {
  return function (el) {
    var _children = handler instanceof Array ? handler : handler(el);

    for (var i = 0; i < _children.length; i++) {
      var child = _children[i];

      if (child && child.nodeType) {
        el.appendChild(child);
      }
    }
  }
}

export function setChildren(parent, _children) {
  var traverse = parent.firstChild;

  for (var i = 0; i < _children.length; i++) {
    var child = _children[i];

    if (child === traverse) {
      traverse = traverse.nextSibling;
    }

    if (child && child.nodeType) {
      if (traverse) {
        parent.insertBefore(child, traverse);
      } else {
        parent.appendChild(child);
      }
    }
  }

  while (traverse) {
    var next = traverse.nextSibling;

    parent.removeChild(traverse);

    traverse = next;
  }
}

export function clearChildren (parent) {
  setChildren(parent, []);
}
