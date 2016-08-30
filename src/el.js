var cached = {};
var cachedSVG = {};

var createSVG = document.createElementNS.bind(document, 'http://www.w3.org/2000/svg');

export function el (query) {
  // check if called with el(Component):
  if (typeof query === 'function') {
    var len = arguments.length - 1;

    // call immediately when no arguments provided
    if (!len) {
      return query();
    }

    // arguments' optimization
    // (https://github.com/petkaantonov/bluebird/wiki/Optimization-killers#3-managing-arguments)
    var args = new Array(len);

    for (var i = 0; i < len; i++) {
      args[i] = arguments[i + 1];
    }

    // call Component(...args)
    return query.apply(this, args);
  }

  // create element with query provided (defaults to 'div')
  var element = createElement(query);
  var empty = true;

  // go through arguments
  for (var i = 1; i < arguments.length; i++) {
    var arg = arguments[i];

    // skip null arguments
    if (arg == null) continue;

    // call function arguments
    if (typeof arg === 'function') {
      arg = arg(element);
    }

    // append strings and numbers as textContent
    if (empty && (typeof arg === 'string' || typeof arg === 'number')) {
      element.textContent = arg;
      empty = false;
      continue;
    }

    // try to mount argument
    if (mount(element, arg)) {
      empty = false;
      continue;
    }

    // go through object argument
    if (typeof arg === 'object') {
      for (var attr in arg) {
        var value = arg[attr];

        // parse style values differently
        if (attr === 'style') {
          // if string, setAttribute instead of property
          if (typeof value === 'string') {
            element.setAttribute(attr, value);
          } else {
            var elementStyle = element.style;

            // if object, go through style keys and set element.style[key] accordingly
            for (var key in value) {
              elementStyle[key] = value[key];
            }
          }
        } else if (attr in element) {
          // set property
          element[attr] = arg[attr];
        } else {
          // set attribute
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
  // if element already created with the query, use it:
  if (query in cached) return cache[query].cloneNode(false);

  var tag, id, className;

  var mode = 0;
  var from = 0;

  // parse query

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

  // create SVG or HTML element
  var el = svg ? createSVG(tag) : document.createElement(tag);

  // set id + classNames
  id && (el.id = id);
  className && (el.className = className);

  // save to cache
  cache[query] = el;

  // return cloned
  return el.cloneNode(false);
}
