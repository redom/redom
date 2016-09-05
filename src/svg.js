import { doc } from './globals';
import { createElement } from './create-element';
import { mount } from './mount';
import { text } from './text';

var SVG = 'http://www.w3.org/2000/svg';

var cache = {};

export function svg (query, a) {
  if (query.nodeType) {
    var element = query.cloneNode(false);
  } else {
    var element = (cache[query] || (cache[query] = createElement(query, SVG))).cloneNode(false);
  }
  var empty = true;

  for (var i = 1; i < arguments.length; i++) {
    var arg = arguments[i];

    empty = parseArgument(element, empty, arg);
  }

  return element;
}

svg.extend = function (query) {
  var element = (cache[query] || (cache[query] = createElement(query, SVG))).cloneNode(false);
  return svg.bind(this, element);
}

function parseArgument (element, empty, arg) {
  if (typeof arg === 'function') {
    arg = arg(element);
    return;
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

  return empty;
}
