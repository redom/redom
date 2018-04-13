import { getEl } from './util.js';
import { trigger } from './mount.js';

export const unmount = (parent, child) => {
  const parentEl = getEl(parent);
  const childEl = getEl(child);

  if (child === childEl && childEl.__redom_view) {
    // try to look up the view if not provided
    child = childEl.__redom_view;
  }

  if (childEl.parentNode) {
    doUnmount(child, childEl, parentEl);

    parentEl.removeChild(childEl);
  }

  return child;
};

export const doUnmount = (child, childEl, parentEl) => {
  const hooks = childEl.__redom_lifecycle;

  if (!hooks) {
    childEl.__redom_mounted = false;
    return;
  }

  let traverse = parentEl;

  if (childEl.__redom_mounted) {
    trigger(childEl, 'onunmount');
  }

  while (traverse) {
    const parentHooks = traverse.__redom_lifecycle || (traverse.__redom_lifecycle = {});
    let hooksFound = false;

    for (const hook in hooks) {
      if (parentHooks[hook]) {
        parentHooks[hook] -= hooks[hook];
      }
      if (parentHooks[hook]) {
        hooksFound = true;
      }
    }

    if (!hooksFound) {
      traverse.__redom_lifecycle = null;
    }

    traverse = traverse.parentNode;
  }
};
