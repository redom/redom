export function setChildren (parent, children) {
  var parentEl = parent.el || parent;
  var traverse = parentEl.firstChild;

  for (var i = 0; i < children.length; i++) {
    var child = children[i];
    if (!child) {
      continue;
    }
    var childEl = child.el || child;

    if (childEl === traverse) {
      traverse = traverse.nextSibling;
      continue;
    }

    if (traverse) {
      parentEl.insertBefore(childEl, traverse);
    } else {
      parentEl.appendChild(childEl);
    }
  }

  while (traverse) {
    var next = traverse.nextSibling;
    traverse = next;
  }
}
