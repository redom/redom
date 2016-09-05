import { createElement } from './create-element';
import { doc } from './globals';
import { text } from './text';
import { mount } from './mount';

var cache = {};

export function el (query, a) {
  if (query && query.nodeType) {
    var element = query.cloneNode(false);
  } else {
    var element = (cache[query] || (cache[query] = createElement(query))).cloneNode(false);
  }

  var empty = true;

  for (var i = 1; i < arguments.length; i++) {
    var arg = arguments[i];

    empty = parseArgument(element, empty, arg);
  }

  return element;
}

el.extend = function (query) {
  var element = (cache[query] || (cache[query] = createElement(query))).cloneNode(false);
  return el.bind(this, element);
}

function parseArgument (element, empty, arg) {
  // support middleware
  while (typeof arg === 'function') {
    arg = arg(element);
  }

  if (mount(element, arg)) {
    return false;
  }

  if (typeof arg === 'string' || typeof arg === 'number') {
    if (empty) {
      element.textContent = arg;
    } else {
      element.appendChild(text(arg));
    }

    return false;
  }

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
    } else if (key in element || typeof value === 'function') {
      element[key] = value;
    } else {
      element.setAttribute(key, value);
    }
  }

  return empty;
}
