import { mount, unmount } from './mount';
import { getEl } from './util';

export const setChildren = (parent, children) => {
  if (children.length === undefined) {
    return setChildren(parent, [children]);
  }

  const parentEl = getEl(parent);
  let traverse = parentEl.firstChild;

  for (let i = 0; i < children.length; i++) {
    const child = children[i];

    if (!child) {
      continue;
    }

    let childEl = getEl(child);

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
};
