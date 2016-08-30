
import { mount } from './mount';

export function expand (source, a, b, c) {
  var element;

  if (source.nodeType) {
    element = source.cloneNode(false);
  } else if (typeof source === 'string') {
    element = this.createElement(source).cloneNode(false);
  } else if (this.allowComponents) {
    var len = arguments.length;

    switch (len) {
      case 1: return new source();
      case 2: return new source(a);
      case 3: return new source(a, b);
      case 4: return new source(a, b, c);
    }

    var args = new Array(len);
    while (len--) args[len] = arguments[len];

    return new (query.bind.apply(query, args));
  } else {
    throw new Error('Must pass a valid query or component!');
  }

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
        } else if (this.allowBareProps && attr in element) {
          element[attr] = arg[attr];
        } else {
          element.setAttribute(attr, arg[attr]);
        }
      }
    }
  }

  return element;
}


export function createElement (query, svg) {
  var cache = this.cache;

  if (query in cache) return cache[query];

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

  var el = this.createTag(tag);

  id && (el.id = id);
  className && (el.className = className);

  return cache[query] = el;
}
