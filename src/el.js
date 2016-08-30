var cached = {};
var cachedSVG = {};

var createSVG = document.createElementNS.bind(document, 'http://www.w3.org/2000/svg');

export function el (query, a, b, c) {
  if (typeof query === 'function') {
    var len = arguments.length - 1;

    switch (len) {
      case 0: return query();
      case 1: return query(a);
      case 2: return query(a, b);
      case 3: return query(a, b, c);
    }

    var args = new Array(len);
    var i = 0;
    while (i < len) {
      args[i] = arguments[++i];
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

    if (empty && (typeof arg === 'string' || typeof arg === 'number')) {
      element.textContent = arg;
      empty = false;
      continue;
    }

    if (mount(element, arg)) {
      empty = false;
      continue;
    }

    if (typeof arg === 'object') {
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
  return el.bind(this, query);
}

export function createElement (query, svg) {
  var cache = svg ? cachedSVG : cached;

  if (query in cached) return cache[query].cloneNode(false);

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

  cache[query] = el;

  return el.cloneNode(false);
}
