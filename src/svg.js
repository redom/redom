import { doc } from './globals';
import { createElement } from './create-element';
import { mount } from './mount';
import { text } from './text';

var cache = {};

export function svg (query, a) {
  var element = (cache[query] || (cache[query] = createElement(query))).cloneNode(false);
  var empty = true;

  for (var i = 1; i < arguments.length; i++) {
    var arg = arguments[i];

    parseArgument(element, empty, arg);
  }

  return element;
}

svg.extend = function (query) {
  return svg.bind(this, query);
}

function parseArgument (element, empty, arg) {
  while (typeof arg === 'function') {
    arg = arg(element);
  }

  if (mount(element, arg)) {
    return;
  } else if (typeof arg === 'string' || typeof arg === 'number') {
    if (empty) {
      element.textContent = arg;
    } else {
      element.appendChild(text(arg));
    }
  } else {
    for (var key in arg) {
      var value = arg[key];

      if (key === 'style' && typeof value !== 'string') {
        for (var cssKey in value) {
          element.style[cssKey] = value[cssKey];
        }
      } else if (typeof value === 'function') {
        element[key] = value;
      } else {
        element.setAttribute(key, value);
      }
    }
  }
}
