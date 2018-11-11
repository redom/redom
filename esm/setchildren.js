import { mount } from './mount.js';
import { unmount } from './unmount.js';
import _getEl from './util/_getEl.js';
import _isNode from './util/_isNode.js';

export const setChildren = (parent, ...children) => {
  const parentEl = _getEl(parent);
  let current = traverse(parent, children, parentEl.firstChild);

  while (current) {
    const next = current.nextSibling;

    unmount(parent, current);

    current = next;
  }
};

const traverse = (parent, children, _current) => {
  let current = _current;

  const childEls = new Array(children.length);

  for (let i = 0; i < children.length; i++) {
    childEls[i] = children[i] && _getEl(children[i]);
  }

  for (let i = 0; i < children.length; i++) {
    const child = children[i];

    if (!child) {
      continue;
    }

    let childEl = childEls[i];

    if (childEl === current) {
      current = current.nextSibling;
      continue;
    }

    if (_isNode(childEl)) {
      const next = current && current.nextSibling;
      const exists = child.__redom_index != null;
      const replace = exists && next === childEls[i + 1];

      mount(parent, child, current, replace);

      if (replace) {
        current = next;
      }

      continue;
    }

    if (child.length != null) {
      current = traverse(parent, child, current);
    }
  }

  return current;
};
