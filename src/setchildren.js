import { mount } from './mount';

export function setChildren (parent, children) {
  var parentEl = parent.el || parent;
  var traverse = parentEl.firstChild;

  for (var i = 0; i < children.length; i++) {
    var child = children[i];
    var childEl = child.el || child;

    if (childEl === traverse) {
      traverse = traverse.nextSibling;
      continue;
    }

    mount(parent, child);
  }

  while (traverse) {
    var next = traverse.nextSibling;
    parentEl.removeChild(traverse);
    traverse = next;
  }
}
