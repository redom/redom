
import { text } from './text';
import { setChildren } from './setchildren';

export function mount (parent, child, before) {
  var parentEl = parent.el || parent;
  var childEl = child.el || child;
  var wasMounted = childEl.isMounted;

  if (childEl.nodeType) {
    if (child !== childEl) {
      childEl.view = child;
    }
    if (before) {
      parentEl.insertBefore(childEl, before.el || before);
    } else {
      parentEl.appendChild(childEl);
    }
    if (wasMounted) {
      child.remounted && child.remounted();
    } else {
      childEl.isMounted = true;
      child.mounted && child.mounted();
    }
    return true;
  } else if (child.length) {
    for (var i = 0; i < child.length; i++) {
      mount(parent, child[i], before);
    }
    return true;
  }
  return false;
}

export function unmount (parent, child) {
  var parentEl = parent.el || parent;
  var childEl = child.el || child;

  parentEl.removeChild(childEl);

  childEl.isMounted = false;
  child.unmounted && child.unmounted();
}
