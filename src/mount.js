import { isList } from './util';

export function mount (parent, child, before) {
  const parentEl = parent.el || parent;
  let childEl = child.el || child;

  if (isList(childEl)) {
    childEl = childEl.el;
  }

  if (child === childEl && childEl.__redom_view) {
    // try to look up the view if not provided
    child = childEl.__redom_view;
  }

  if (child !== childEl) {
    childEl.__redom_view = child;
  }

  const wasMounted = childEl.__redom_mounted;

  if (wasMounted) {
    prepareUnmount(child, childEl, parentEl);
  }

  if (before) {
    parentEl.insertBefore(childEl, before.el || before);
  } else {
    parentEl.appendChild(childEl);
  }

  prepareMount(child, childEl, parentEl);

  return child;
}

function trigger (childEl, eventName) {
  let children = [childEl];

  while (children && children.length) {
    const newChildren = [];

    for (let i = 0; i < children.length; i++) {
      const childEl = children[i];

      if (eventName === 'mount') {
        childEl.__redom_mounted = true;
      } else if (eventName === 'unmount') {
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

const hookNames = ['mount', 'unmount'];

function prepareMount (child, childEl, parentEl) {
  const hooks = childEl.__redom_lifecycle || (childEl.__redom_lifecycle = {});
  let hooksFound = false;

  if (child !== childEl) {
    for (let i = 0; i < hookNames.length; i++) {
      const hookName = hookNames[i];

      if (hookName in child) {
        hooks[hookName] || (hooks[hookName] = 0);
        hooks[hookName]++;
        hooksFound = true;
      }
    }
  }

  if (!hooksFound) {
    return;
  }

  let traverse = parentEl;
  let triggered = false;

  if (!triggered && (traverse && traverse.__redom_mounted)) {
    trigger(childEl, 'mount');
    triggered = true;
  }

  while (traverse) {
    const parent = traverse.parentNode;
    const parentHooks = traverse.__redom_lifecycle || (traverse.__redom_lifecycle = {});

    for (const hook in hooks) {
      parentHooks[hook] || (parentHooks[hook] = 0);
      parentHooks[hook] += hooks[hook];
    }

    if (!triggered && (traverse === document || (parent && parent.__redom_mounted))) {
      trigger(traverse, 'mount');
      triggered = true;
    }

    traverse = parent;
  }
}

function prepareUnmount (child, childEl, parentEl) {
  const hooks = childEl.__redom_lifecycle;

  if (!hooks) {
    return;
  }

  let traverse = parentEl;

  if (childEl.__redom_mounted) {
    trigger(childEl, 'unmount');
  }

  while (traverse) {
    const parentHooks = traverse.__redom_lifecycle;

    if (hooks) {
      for (const hook in hooks) {
        if (parentHooks[hook]) {
          parentHooks[hook] -= hooks[hook];
        }
      }
    }

    traverse = traverse.parentNode;
  }
}

export function unmount (parent, child) {
  const parentEl = parent.el || parent;
  const childEl = child.el || child;

  if (child === childEl && childEl.__redom_view) {
    // try to look up the view if not provided
    child = childEl.__redom_view;
  }

  prepareUnmount(child, childEl, parentEl);

  parentEl.removeChild(childEl);

  return child;
}
