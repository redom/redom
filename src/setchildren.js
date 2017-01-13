import { mount, unmount } from './mount';

export function setChildren (parent, children) {
  if (children.length == null) {
    return setChildren(parent, [children]);
  }

  const parentEl = parent.el || parent;
  let traverse = parentEl.firstChild;

  for (let i = 0; i < children.length; i++) {
    const child = children[i];

    if (!child) {
      continue;
    }

    let childEl = child.el || child;

    if (childEl.__redom_list) {
      childEl = childEl.el;
    }

    if (childEl === traverse) {
      traverse = traverse.nextSibling;
      continue;
    }

    mount(parent, child, traverse);
  }

  while (traverse) {
    const next = traverse.nextSibling;

    unmount(parent, traverse);

    traverse = next;
  }
}
