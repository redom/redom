var cached = {};
var clones = {};

import { createElement } from './el';

export function svg (query) {
  var clone = clones[query] || (clones[query] = createElement(query, true));
  var element = clone.cloneNode(false);
  var empty = true;

  for (var i = 1; i < arguments.length; i++) {
    var arg = arguments[i];

    if (arg == null) continue;

    if (typeof arg === 'function') {
      arg = arg(element);
    }

    if (empty && (arg === String || arg === Number)) {
      element.textContent = arg;
      empty = false;
      continue;
    }

    if (mount(element, arg)) {
      empty = false;
      continue;
    }

    for (var attr in arg) {
      if (attr === 'style') {
        var elementStyle = element.style;
        var style = arg.style;
        if (typeof style !== 'string') {
          for (var key in style) {
            elementStyle[key] = style[key];
          }
        } else {
          element.setAttribute(attr, arg[attr]);
        }
      } else {
        element.setAttribute(attr, arg[attr]);
      }
    }
  }

  return element;
}

svg.extend = function (query) {
  return svg.bind(this, query);
}
