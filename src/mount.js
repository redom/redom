import { isList, getParentElRecursive } from './util';

const hookNames = ['onmount', 'onunmount'];

export function mount (parent, child, before) {
  const parentEl = getParentElRecursive(parent);
  let childEl = getParentElRecursive(child);

  if (child === childEl && childEl.__redom_view) {
    // try to look up the view if not provided
    child = childEl.__redom_view;
  }

  if (child !== childEl) {
    childEl.__redom_view = child;
  }

  const wasMounted = childEl.__redom_mounted;
  const oldParent = childEl.parentNode;

  if (wasMounted && (oldParent !== parentEl)) {
    doUnmount(child, childEl, oldParent);
  }

  if (before) {
    parentEl.insertBefore(childEl, getParentElRecursive(before));
  } else {
    parentEl.appendChild(childEl);
  }

  doMount(child, childEl, parentEl, oldParent);

  return child;
}

export function unmount (parent, child) {
  const parentEl = parent.el || parent;
  const childEl = child.el || child;

  if (child === childEl && childEl.__redom_view) {
    // try to look up the view if not provided
    child = childEl.__redom_view;
  }

  doUnmount(child, childEl, parentEl);

  parentEl.removeChild(childEl);

  return child;
}

function doMount (child, childEl, parentEl, oldParent) {
  const hooks = childEl.__redom_lifecycle || (childEl.__redom_lifecycle = {});
  const remount = (parentEl === oldParent);
  let hooksFound = false;

  if (child !== childEl) {
    for (let i = 0; i < hookNames.length; i++) {
      const hookName = hookNames[i];

      if (!remount && (hookName in child)) {
        hooks[hookName] = (hooks[hookName] || 0) + 1;
      }
      if (hooks[hookName]) {
        hooksFound = true;
      }
    }
  }

  if (!hooksFound) {
    return;
  }

  let traverse = parentEl;
  let triggered = false;

  if (remount || (!triggered && (traverse && traverse.__redom_mounted))) {
    trigger(childEl, remount ? 'onremount' : 'onmount');
    triggered = true;
  }

  if (remount) {
    return;
  }

  while (traverse) {
    const parent = traverse.parentNode;
    const parentHooks = traverse.__redom_lifecycle || (traverse.__redom_lifecycle = {});

    for (const hook in hooks) {
      parentHooks[hook] = (parentHooks[hook] || 0) + hooks[hook];
    }

    if (!triggered && (traverse === document || (parent && parent.__redom_mounted))) {
      trigger(traverse, remount ? 'onremount' : 'onmount');
      triggered = true;
    }

    traverse = parent;
  }
}

function doUnmount (child, childEl, parentEl) {
  const hooks = childEl.__redom_lifecycle;

  if (!hooks) {
    return;
  }

  let traverse = parentEl;

  if (childEl.__redom_mounted) {
    trigger(childEl, 'onunmount');
  }

  while (traverse) {
    const parentHooks = traverse.__redom_lifecycle;
    let hooksFound = false;

    if (hooks) {
      for (const hook in hooks) {
        if (parentHooks[hook]) {
          parentHooks[hook] -= hooks[hook];
        }
        if (parentHooks[hook]) {
          hooksFound = true;
        }
      }
    }

    if (!hooksFound) {
      traverse.__redom_lifecycle = null;
    }

    traverse = traverse.parentNode;
  }
}

function trigger (childEl, eventName) {
  let children = [childEl];

  while (children && children.length) {
    const newChildren = [];

    for (let i = 0; i < children.length; i++) {
      const childEl = children[i];

      if (eventName === 'onmount') {
        childEl.__redom_mounted = true;
      } else if (eventName === 'onunmount') {
        childEl.__redom_mounted = false;
      }

      const hooks = childEl.__redom_lifecycle;

      if (!hooks) {
        continue;
      }

      const view = childEl.__redom_view;
      let hookCount = 0;

      view && view[eventName] && view[eventName]();

      for (const hook in hooks) {
        if (hook) {
          hookCount++;
        }
      }

      if (!hookCount) {
        continue;
      }

      const grandChildren = childEl.childNodes;

      for (let i = 0; i < grandChildren.length; i++) {
        newChildren.push(grandChildren[i]);
      }
    }

    children = newChildren;
  }
}
