
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
    if (childEl.mounted) {
      child.mounted = false;
      child.unmount && child.unmount();
      notifyUnmountDown(childEl);
    }
    doMount(parentEl, childEl, before);
    childEl.mounted = true;
    child.mount && child.mount();
    if (parentEl.mounted || document.contains(childEl)) {
      notifyMountDown(childEl);
    }
    return true;
  }
  return false;
}

function notifyMountDown (child) {
  var traverse = child.firstChild;

  while (traverse) {
    traverse.mounted = true;
    traverse.mount && traverse.mount();
    notifyMountDown(traverse);
    traverse = traverse.nextSibling;
  }
}

function notifyUnmountDown (child) {
  var traverse = child.firstChild;

  while (traverse) {
    traverse.mounted = false;
    traverse.unmount && traverse.unmount();
    notifyUnmountDown(traverse);
    traverse = traverse.nextSibling;
  }
}
