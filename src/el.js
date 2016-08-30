var cached = {};
var clones = {};

var createSVG = document.createElementNS.bind(document, 'http://www.w3.org/2000/svg');

export function el (query) {
  var clone = clones[query] || (clones[query] = createElement(query));
  var element = clone.cloneNode(false);
  var empty = true;

  for (var i = 1; i < arguments.length; i++) {
    var arg = arguments[i];

    if (arg == null) continue;

    if (typeof arg === 'function') {
      arg = arg(element);
    }

    var type = arg.constructor;

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
        if (style.constructor !== String) {
          for (var key in style) {
            elementStyle[key] = style[key];
          }
        } else {
          element.setAttribute(attr, arg[attr]);
        }
      } else if (attr in element) {
        element[attr] = arg[attr];
      } else {
        element.setAttribute(attr, arg[attr]);
      }
    }
  }

  return element;
}

el.extend = function (query) {
  return el.bind(this, query);
}

export function createElement (query, svg) {
  if (query in cached) return cached[query];

  var tag, id, className;

  var mode = 0;
  var from = 0;

  for (var i = 0, len = query.length; i <= len; i++) {
    var cp = i === len ? 0 : query.charCodeAt(i);

    if (cp === 0x23 || cp === 0x2E || cp === 0) {
      var slice = query.substring(from, i);

      if (mode === 0) {
        tag = i === 0 ? 'div' : slice;
      } else if (mode === 1) {
        id = slice;
      } else {
        if (className) {
          className += ' ' + slice;
        } else {
          className = slice;
        }
      }

      from = i + 1;
      mode = cp === 0x23 ? 1 : 2;
    }
  }

  if (svg) {
    var el = createSVG(tag);
  } else {
    var el = document.createElement(tag);
  }

  id && (el.id = id);
  className && (el.className = className);

  return cached[query] = el;
}
