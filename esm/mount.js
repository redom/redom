/* global Node, ShadowRoot */

import { getEl } from "./util.js";
import { doUnmount } from "./unmount.js";

const hookNames = ["onmount", "onremount", "onunmount"];
const shadowRootAvailable =
  typeof window !== "undefined" && "ShadowRoot" in window;

export function mount(parent, child, before, replace) {
  const parentEl = getEl(parent);
  const childEl = getEl(child);

  if (child === childEl && childEl.__redom_view) {
    // try to look up the view if not provided
    child = childEl.__redom_view;
  }

  if (child !== childEl) {
    childEl.__redom_view = child;
  }

  const wasMounted = childEl.__redom_mounted;
  const oldParent = childEl.parentNode;

  if (wasMounted && oldParent !== parentEl) {
    doUnmount(child, childEl, oldParent);
  }

  if (before != null) {
    if (replace) {
      const beforeEl = getEl(before);

      if (beforeEl.__redom_mounted) {
        trigger(beforeEl, "onunmount");
      }

      parentEl.replaceChild(childEl, beforeEl);
    } else {
      parentEl.insertBefore(childEl, getEl(before));
    }
  } else {
    parentEl.appendChild(childEl);
  }

  doMount(child, childEl, parentEl, oldParent);

  return child;
}

export function trigger(el, eventName) {
  if (eventName === "onmount" || eventName === "onremount") {
    el.__redom_mounted = true;
  } else if (eventName === "onunmount") {
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

function doMount(child, childEl, parentEl, oldParent) {
  const hooks = childEl.__redom_lifecycle || (childEl.__redom_lifecycle = {});
  const remount = parentEl === oldParent;
  let hooksFound = false;

  for (const hookName of hookNames) {
    if (!remount) {
      // if already mounted, skip this phase
      if (child !== childEl) {
        // only Views can have lifecycle events
        if (hookName in child) {
          hooks[hookName] = (hooks[hookName] || 0) + 1;
        }
      }
    }
    if (hooks[hookName]) {
      hooksFound = true;
    }
  }

  if (!hooksFound) {
    childEl.__redom_lifecycle = {};
    return;
  }

  let traverse = parentEl;
  let triggered = false;

  if (remount || (traverse && traverse.__redom_mounted)) {
    trigger(childEl, remount ? "onremount" : "onmount");
    triggered = true;
  }

  while (traverse) {
    const parent = traverse.parentNode;
    const parentHooks =
      traverse.__redom_lifecycle || (traverse.__redom_lifecycle = {});

    for (const hook in hooks) {
      parentHooks[hook] = (parentHooks[hook] || 0) + hooks[hook];
    }

    if (triggered) {
      break;
    } else {
      if (
        traverse.nodeType === Node.DOCUMENT_NODE ||
        (shadowRootAvailable && traverse instanceof ShadowRoot) ||
        (parent && parent.__redom_mounted)
      ) {
        trigger(traverse, remount ? "onremount" : "onmount");
        triggered = true;
      }
      traverse = parent;
    }
  }
}
