import { createElement } from './create-element';
import { doc } from './globals';
import { text } from './text';
import { mount } from './mount';

var cache = {};

export function el (query, a) {
  if (typeof query === 'function') {
    // support JSX <Myclass> -style – with RE:DOM you can just call "new Myclass" instead
    var len = arguments.length - 1;

    if (len < 2) {
      // the most usual case
      return new query(a);
    } else {
      var args = new Array(len);
      var i = 0;

      while (i < len) args[++i] = arguments[i];

      return new (query.bind.apply(query, args));
    }
  }
  var element = (cache[query] || (cache[query] = createElement(query))).cloneNode(false);
  var empty = true;

  for (var i = 1; i < arguments.length; i++) {
    var arg = arguments[i];

    parseArgument(element, empty, arg);
  }

  return element;
}

el.extend = function (query) {
  return el.bind(this, query);
}

function parseArgument (element, empty, arg) {
  // support middleware
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

      if (key === 'style') {
        if (typeof value === 'string') {
          element.setAttribute(key, value);
        } else {
          for (var cssKey in value) {
            element.style[cssKey] = value[cssKey];
          }
        }
        element[key] = value;
      } else if (key in element || typeof value === 'function') {
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
