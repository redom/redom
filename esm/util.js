import { html } from './html.js';
import { mount } from './mount.js';
import { setAttr } from './setattr.js';
import { text } from './text.js';

export const mwFuncs = []; // this is where middleware lives

export const parseArguments = (element, args) => {
  for (const arg of args) {
    if (arg !== 0 && !arg) {
      continue;
    }

    const type = typeof arg;

    for (let func of mwFuncs) {
      func(element, ...args); // execute middleware
    }

    // support middleware
    if (type === 'function') {
      arg(element);
    } else if (type === 'string' || type === 'number') {
      element.appendChild(text(arg));
    } else if (isNode(getEl(arg))) {
      mount(element, arg);
    } else if (arg.length) {
      parseArguments(element, arg);
    } else if (type === 'object') {
      setAttr(element, arg);
    }
  }
};

export const ensureEl = parent => typeof parent === 'string' ? html(parent) : getEl(parent);
export const getEl = parent => (parent.nodeType && parent) || (!parent.el && parent) || getEl(parent.el);
export const isNode = a => a && a.nodeType;
export const isList = a => a && a.__redom_list;
