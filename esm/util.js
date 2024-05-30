import { html } from "./html.js";
import { mount } from "./mount.js";
import { setAttrInternal } from "./setattr.js";
import { text } from "./text.js";

export function parseArguments(element, args) {
  parseArgumentsInternal(element, args);
}

export function parseArgumentsInternal(element, args, initial) {
  for (const arg of args) {
    if (arg !== 0 && !arg) {
      continue;
    }

    const type = typeof arg;

    if (type === "function") {
      arg(element);
    } else if (type === "string" || type === "number") {
      element.appendChild(text(arg));
    } else if (isNode(getEl(arg))) {
      mount(element, arg);
    } else if (arg.length) {
      parseArgumentsInternal(element, arg, initial);
    } else if (type === "object") {
      setAttrInternal(element, arg, null, initial);
    }
  }
}

export function ensureEl(parent) {
  return typeof parent === "string" ? html(parent) : getEl(parent);
}

export function getEl(parent) {
  return (
    (parent.nodeType && parent) || (!parent.el && parent) || getEl(parent.el)
  );
}

export function isNode(arg) {
  return arg && arg.nodeType;
}
