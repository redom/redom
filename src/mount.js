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

  if (child.__redom_mounted) {
    prepareUnmount(child, childEl, parentEl);
  }

  if (before) {
    parentEl.insertBefore(childEl, before.el || before);
  } else {
    parentEl.appendChild(childEl);
  }

  if (!child.__redom_mounted) {
    prepareMount(child, childEl, parentEl);
  }

  return child;
}

const handlerNames = ['mount', 'remount', 'unmount'];

function trigger (child, eventName) {
  if (eventName === 'mount') {
    child.__redom_mounted = true;
  } else if (eventName === 'unmount') {
    child.__redom_mounted = false;
  }

  const hooks = child.__redom_lifecycle;

  if (!hooks) {
    return;
  }

  const view = child.__redom_view;
  let hookCount = 0;

  view && view[eventName] && view[eventName]();

  for (const hook in hooks) {
    if (hook) {
      hookCount++;
    }
  }

  const children = child.childNodes;

  if (!children || !hookCount) {
    return;
  }

  for (let i = 0; i < children.length; i++) {
    trigger(children[i], eventName);
  }
}

function prepareMount (child, childEl, parentEl) {
  const handlers = {};
  const hooks = childEl.__redom_lifecycle || (childEl.__redom_lifecycle = {});

  for (const hook in hooks) {
    handlers[hook] || (handlers[hook] = 0);
    handlers[hook] += hooks[hook];
  }

  if (child !== childEl) {
    for (let i = 0; i < handlerNames.length; i++) {
      const handlerName = handlerNames[i];

      if (handlerName in child) {
        hooks[handlerName] || (hooks[handlerName] = 0);
        hooks[handlerName]++;

        handlers[handlerName] || (handlers[handlerName] = 0);
        handlers[handlerName]++;
      }
    }
  }

  let traverse = parentEl;

  while (traverse) {
    const hooks = traverse.__redom_lifecycle || (traverse.__redom_lifecycle = {});

    for (const hook in handlers) {
      hooks[hook] || (hooks[hook] = 0);
      hooks[hook] += handlers[hook];
    }

    if (traverse === document) {
      trigger(traverse, 'mount');
    }

    traverse = traverse.parentNode;
  }
}

function prepareUnmount (child, childEl, parentEl) {
  const handlers = {};
  const hooks = childEl.__redom_lifecycle || (childEl.__redom_lifecycle = {});

  for (const hook in hooks) {
    handlers[hook] || (handlers[hook] = 0);
    handlers[hook] += hooks[hook];
  }

  if (child !== childEl) {
    for (let i = 0; i < handlerNames.length; i++) {
      const handlerName = handlerNames[i];

      if (handlerName in child) {
        hooks[handlerName] || (hooks[handlerName] = 0);
        hooks[handlerName]--;
      }
    }
  }

  let traverse = parentEl;

  while (traverse) {
    const hooks = traverse.__redom_lifecycle || (traverse.__redom_lifecycle = {});

    for (const hook in handlers) {
      hooks[hook] || (hooks[hook] = 0);
      hooks[hook] -= handlers[hook];
    }

    if (traverse === document) {
      trigger(traverse, 'unmount');
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
