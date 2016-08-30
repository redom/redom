
import { mount } from './mount';

var cached = {};
var cachedSVG = {};

var createSVG = document.createElementNS.bind(document, 'http://www.w3.org/2000/svg');

export function el (query, a, b, c, d, e, f) {
  var len = arguments.length;
  var args;

  if (len === 0) throw new Error('Must pass a query or a component!');

  if (len > 7) {
    args = new Array(len);
    for (var i = 0; i < len; i++) {
      args[i] = arguments[i];
    }
  }

  if (typeof query === 'function') {
    return len === 1 ? new query()
         : len === 2 ? new query(a)
         : len === 3 ? new query(a, b)
         : len === 4 ? new query(a, b, c)
         : len === 5 ? new query(a, b, c, d)
         : len === 6 ? new query(a, b, c, d, e)
         : len === 7 ? new query(a, b, c, d, e, f)
         : new (query.bind.apply(query, args));
  }

  var element = createElement(query);

  return len === 1 ? expand(element)
       : len === 2 ? expand(element, a)
       : len === 3 ? expand(element, a, b)
       : len === 4 ? expand(element, a, b, c)
       : len === 5 ? expand(element, a, b, c, d)
       : len === 6 ? expand(element, a, b, c, d, e)
       : len === 7 ? expand(element, a, b, c, d, e, f)
       : (args[0] = element, expand.apply(this, args));
}

function expand (templateElement) {
  var element = templateElement.cloneNode(false);
  var empty = true;

  for (var i = 1; i < arguments.length; i++) {
    var arg = arguments[i];

    if (typeof arg === 'string' || typeof arg === 'number') {
      if (empty) {
        element.textContent = arg;
        empty = false;
      } else {
        element.appendChild(document.createTextNode(arg));
      }
      continue;
    }

    if (typeof arg === 'function') {
      arg = arg(element);
    }

    // null guard before we attempt to mount
    if (arg == null) continue;

    if (mount(element, arg)) {
      empty = false;
    } else {
      for (var attr in arg) {
        var value = arg[attr];

        if (attr === 'style') {
          if (typeof value === 'string') {
            element.setAttribute(attr, value);
          } else {
            var elementStyle = element.style;

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
  }

  return element;
}

el.extend = function (query) {
  return expand.bind(this, createElement(query));
}

export function createElement (query, svg) {
  var cache = svg ? cachedSVG : cached;

  if (query in cached) return cache[query];

  // query parsing magic by https://github.com/maciejhirsz

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

  return cache[query] = el;
}
