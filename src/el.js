import { createElement } from './create-element';

var cache = {};

export function el (query, a) {
  if (typeof query === 'function') {
    var len = arguments.length - 1;
    if (len > 1) {
      var args = new Array(len);
      var i = 0;

      while (i < len) args[++i] = arguments[i];

      return new (query.bind.apply(query, args));
    } else {
      return new query(a);
    }
  }
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
        childEl.__redom_view = child;
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

        if (key === 'style') {
          if (typeof value === 'string') {
            element.setAttribute(key, value);
          } else {
            for (var cssKey in value) {
              element.style[cssKey] = value[cssKey];
            }
          }
        } else if (key in element) {
          element[key] = value;
          if (key === 'autofocus') {
            element.focus();
          }
        } else {
          element.setAttribute(key, value);
        }
      }
    }
  }

  return element;
}

el.extend = function (query) {
  return el.bind(this, query);
}
