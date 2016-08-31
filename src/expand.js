
import { mount } from './mount';

export function expand (element, arg, empty) {
  if (typeof arg === 'string') {
    if (empty) {
      element.textContent = arg;
    } else {
      element.appendChild(document.createTextNode(arg));
    }
    return false;
  }

  if (typeof arg === 'function') {
    arg = arg(element);
  }

  // null guard before we attempt to mount
  if (arg == null) return empty;

  if (mount(element, arg)) return false;

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

  return empty;
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
