
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
  var childEl = child.el || child;
  var type = child && child.constructor;

  if (type === String || type === Number) {
    doMount(parentEl, text(child), before);
    return true;
  } else if (type === Array) {
    for (var i = 0; i < child.length; i++) {
      mount(parentEl, child[i], before);
    }
    return true;
  } else if (childEl.nodeType) {
    doMount(parentEl, childEl, before);
    return true;
  }
  return false;
}
