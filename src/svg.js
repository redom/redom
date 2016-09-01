import { createElement } from './create-element';

var cache = {};

export function svg (query, a) {
  var element = (cache[query] || (cache[query] = createElement(query))).cloneNode(false);
  var empty = true;

  for (var i = 1; i < arguments.length; i++) {
    var arg = arguments[i];

    while (typeof arg === 'function') {
      arg = arg(element);
    }

    if (arg == null) {
      continue;
    }

    if (arg.nodeType) {
      element.appendChild(arg);
    } else if (typeof arg === 'string' || typeof arg === 'number') {
      if (empty) {
        element.textContent = arg;
      } else {
        element.appendChild(document.createTextNode(arg));
      }
    } else if (arg.el && arg.el.nodeType) {
      var child = arg;
      var childEl = arg.el;

      if (child !== childEl) {
        child.el = childEl;
      }

      if (child.isMounted) {
        child.remounted && child.remounted();
      } else {
        child.mounted && child.mounted();
      }

      element.appendChild(childEl);
    } else {
      for (var key in arg) {
        var value = arg[key];

        if (key === 'style' && typeof value !== 'string') {
          for (var cssKey in value) {
            element.style[cssKey] = value[cssKey];
          }
        } else {
          element.setAttribute(key, value);
        }
      }
    }
  }

  return element;
}

svg.extend = function (query) {
  return svg.bind(this, query);
}
