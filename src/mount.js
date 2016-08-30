
import { text } from './text';

function doMount (parent, child, before) {
  if (before) {
    parent.insertBefore(child, before.el || before);
  } else {
    parent.appendChild(child);
  }
}

export function mount (parent, child, before) {
  var parentEl = parent.el || parent;
  var type = child && child.constructor;

  if (type === String || type === Number) {
    doMount(parent, text(child), before);
    return true;
  } else if (type === Array) {
    for (var i = 0; i < child.length; i++) {
      mount(parent, child[i], before);
    }
    return true;
  } else if (child.nodeType) {
    var childEl = child.el || child;

    doMount(parent, child, before);
    return true;
  }
  return false;
}
