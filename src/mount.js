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

const handlerNames = ['mount', 'unmount'];

function trigger (childEl, eventName) {
  if (eventName === 'mount') {
    childEl.__redom_mounted = true;
  } else if (eventName === 'unmount') {
    childEl.__redom_mounted = false;
  }

  const hooks = childEl.__redom_lifecycle;

  if (!hooks) {
    return;
  }

  const view = childEl.__redom_view;
  let hookCount = 0;

  view && view[eventName] && view[eventName]();

  for (const hook in hooks) {
    if (hook) {
      hookCount++;
    }
  }

  const children = childEl.childNodes;

  if (children && hookCount) {
    for (let i = 0; i < children.length; i++) {
      trigger(children[i], eventName);
    }
  }
}

function prepareMount (child, childEl, parentEl) {
  const handlers = {};
  const hooks = childEl.__redom_lifecycle || (childEl.__redom_lifecycle = {});
  let hooksFound = false;

  for (const hook in hooks) {
    handlers[hook] || (handlers[hook] = 0);
    handlers[hook] += hooks[hook];
    hooksFound = true;
  }

  if (child !== childEl) {
    for (let i = 0; i < handlerNames.length; i++) {
      const handlerName = handlerNames[i];

      if (handlerName in child) {
        hooks[handlerName] || (hooks[handlerName] = 0);
        hooks[handlerName]++;

        handlers[handlerName] || (handlers[handlerName] = 0);
        handlers[handlerName]++;
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
    const hooks = traverse.__redom_lifecycle || (traverse.__redom_lifecycle = {});

    for (const hook in handlers) {
      hooks[hook] || (hooks[hook] = 0);
      hooks[hook] += handlers[hook];
    }

    if (!triggered && (traverse === document || (parent && parent.__redom_mounted))) {
      trigger(traverse, 'mount');
      triggered = true;
    }

    traverse = parent;
  }
}

function prepareUnmount (child, childEl, parentEl) {
  const handlers = {};
  const hooks = childEl.__redom_lifecycle;
  let hooksFound = false;

  if (!hooks) {
    return;
  }

  for (const hook in hooks) {
    handlers[hook] || (handlers[hook] = 0);
    handlers[hook] += hooks[hook];
    hooksFound = true;
  }

  if (!hooksFound) {
    return;
  }

  let traverse = parentEl;

  if (childEl.__redom_mounted) {
    trigger(childEl, 'unmount');
  }

  while (traverse) {
    const hooks = traverse.__redom_lifecycle;

    if (hooks) {
      for (const hook in handlers) {
        if (hooks[hook]) {
          hooks[hook] -= handlers[hook];
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
