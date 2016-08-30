var cached = {};

var createSVG = document.createElementNS.bind(document, 'http://www.w3.org/2000/svg');

export function el (query) {
  if (typeof query === 'function') {
    var len = arguments.length - 1;

    if (!len) {
      return query();
    }

    var args = new Array(len);

    for (var i = 0; i < len; i++) {
      args[i] = arguments[i + 1];
    }

    return query.apply(this, args);
  }

  var element = createElement(query);
  var empty = true;

  for (var i = 1; i < arguments.length; i++) {
    var arg = arguments[i];

    if (arg == null) continue;

    if (typeof arg === 'function') {
      arg = arg(element);
    }

    if (empty && (typeof arg !== 'object')) {
      element.textContent = arg;
      empty = false;
      continue;
    }

    if (mount(element, arg)) {
      empty = false;
      continue;
    }

    for (var attr in arg) {
      var value = arg[attr];
      if (attr === 'style') {
        var elementStyle = element.style;
        if (typeof value === 'string') {
          element.setAttribute(attr, value);
        } else {
          for (var key in value) {
            elementStyle[key] = value[key];
          }
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
  if (query in cached) return cached[query].cloneNode(false);

  var tag, id, className;

  var mode = 0;
  var from = 0;

  for (var i = 0, len = query.length; i <= len; i++) {
    var cp = i === len ? 0 : query.charCodeAt(i);

    //  cp === '#'     cp === '.'     nullterm
    if (cp === 0x23 || cp === 0x2E || cp === 0) {
      if (mode === 0) {
        tag = i  === 0 ? 'div'
            : cp === 0 ? query
            :            query.substring(from, i);
      } else {
        var slice = query.substring(from, i)
        if (mode === 1) {
          id = slice;
        } else if (className) {
          className += ' ' + slice;
        } else {
          className = slice;
        }
      }

      from = i + 1;
      mode = cp === 0x23 ? 1 : 2;
    }
  }

  var el = svg ? createSVG(tag) : document.createElement(tag);

  id && (el.id = id);
  className && (el.className = className);

  cached[query] = el;

  return el.cloneNode(false);
}
