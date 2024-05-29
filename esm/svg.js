import { createElement } from "./create-element.js";
import { parseArgumentsInternal, getEl } from "./util.js";

const ns = "http://www.w3.org/2000/svg";

export function svg(query, ...args) {
  let element;

  const type = typeof query;

  if (type === "string") {
    element = createElement(query, ns);
  } else if (type === "function") {
    const Query = query;
    element = new Query(...args);
  } else {
    throw new Error("At least one argument required");
  }

  parseArgumentsInternal(getEl(element), args, true);

  return element;
}

export const s = svg;

svg.extend = function extendSvg(...args) {
  return svg.bind(this, ...args);
};

svg.ns = ns;
