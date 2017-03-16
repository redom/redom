import { text } from './text';
import { mount } from './mount';
import { setAttr } from './setattr';

export function parseArguments (element, args) {
  for (let i = 0; i < args.length; i++) {
    const arg = args[i];

    if (!arg) {
      continue;
    }

    // support middleware
    if (typeof arg === 'function') {
      arg(element);
    } else if (isString(arg) || isNumber(arg)) {
      element.appendChild(text(arg));
    } else if (isNode(arg) || isNode(arg.el) || isList(arg.el)) {
      mount(element, arg);
    } else if (arg.length) {
      parseArguments(element, arg);
    } else if (typeof arg === 'object') {
      setAttr(element, arg);
    }
  }
}

export const isString = a => typeof a === 'string';
export const isNumber = a => typeof a === 'number';
export const isFunction = a => typeof a === 'function';

export const isNode = a => a && a.nodeType;
export const isList = a => a && a.__redom_list;

export const doc = document;
