import { getEl } from './util';

const hookNames = ['onmount', 'onunmount'];

export function mount (parent, child, before) {
  const parentEl = getEl(parent);
  let childEl = getEl(child);

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
    parentEl.insertBefore(childEl, getEl(before));
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

  for (let i = 0; i < hookNames.length; i++) {
    const hookName = hookNames[i];

    if (!remount && (child !== childEl) && (hookName in child)) {
      hooks[hookName] = (hooks[hookName] || 0) + 1;
    }
    if (hooks[hookName]) {
      hooksFound = true;
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
}

function trigger (el, eventName) {
  if (eventName === 'onmount') {
    el.__redom_mounted = true;
  } else if (eventName === 'onunmount') {
    el.__redom_mounted = false;
  }

  const hooks = el.__redom_lifecycle;

  if (!hooks) {
    return;
  }

  const view = el.__redom_view;
  let hookCount = 0;

  view && view[eventName] && view[eventName]();

  for (const hook in hooks) {
    if (hook) {
      hookCount++;
    }
  }

  if (hookCount) {
    let traverse = el.firstChild;

    while (traverse) {
      const next = traverse.nextSibling;

      trigger(traverse, eventName);

      traverse = next;
    }
  }
}
