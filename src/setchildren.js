import { mount } from './mount';
import { unmount } from './unmount';
import { getEl } from './util';

export const setChildren = (parent, ...children) => {
  const parentEl = getEl(parent);
  let current = traverse(parent, children, parentEl.firstChild);

  while (current) {
    const next = current.nextSibling;

    unmount(parent, current);

    current = next;
  }
};

function traverse (parent, children, _current) {
  let current = _current;

  for (let i = 0; i < children.length; i++) {
    const child = children[i];

    if (!child) {
      continue;
    }

    if (child.length != null) {
      current = traverse(parent, child, current);
      continue;
    }

    let childEl = getEl(child);

    if (childEl === current) {
      current = current.nextSibling;
      continue;
    }
    console.log(child);
    mount(parent, child, current);
  }

  return current;
}
