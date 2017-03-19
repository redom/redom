import { isFunction, isList } from './util';

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

  if (child.isMounted) {
    child.remount && child.remount();
  } else {
    child.mount && child.mount();
  }

  if (before) {
    parentEl.insertBefore(childEl, before.el || before);
  } else {
    parentEl.appendChild(childEl);
  }

  if (child.isMounted && isFunction(child.remounted)) {
    setTimeout(() => child.remounted(), 0);
  } else {
    child.isMounted = true;
    if (isFunction(child.mounted)) {
      setTimeout(() => child.mounted(), 0);
    }
  }

  return child;
}

export function unmount (parent, child) {
  const parentEl = parent.el || parent;
  const childEl = child.el || child;

  if (child === childEl && childEl.__redom_view) {
    // try to look up the view if not provided
    child = childEl.__redom_view;
  }

  child.unmount && child.unmount();

  parentEl.removeChild(childEl);

  child.isMounted = false;
  child.unmounted && child.unmounted();

  return child;
}
