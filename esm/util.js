import { html } from './html.js';
import { mount } from './mount.js';
import { setAttr } from './setattr.js';
import { text } from './text.js';

export const parseArguments = (element, args) => {
  for (let i = 0; i < args.length; i++) {
    const arg = args[i];

    if (arg !== 0 && !arg) {
      continue;
    }

    // support middleware
    if (typeof arg === 'function') {
      arg(element);
    } else if (isString(arg) || isNumber(arg)) {
      element.appendChild(text(arg));
    } else if (isNode(getEl(arg))) {
      mount(element, arg);
    } else if (arg.length) {
      parseArguments(element, arg);
    } else if (typeof arg === 'object') {
      setAttr(element, arg);
    }
  }
};

export const ensureEl = parent => isString(parent) ? html(parent) : getEl(parent);
export const getEl = parent => (parent.nodeType && parent) || (!parent.el && parent) || getEl(parent.el);

export const isString = a => typeof a === 'string';
export const isNumber = a => typeof a === 'number';
export const isFunction = a => typeof a === 'function';

export const isNode = a => a && a.nodeType;
export const isList = a => a && a.__redom_list;
