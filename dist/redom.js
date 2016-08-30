(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
  typeof define === 'function' && define.amd ? define(['exports'], factory) :
  (factory((global.redom = global.redom || {})));
}(this, (function (exports) { 'use strict';

var cached = {};
var clones = {};

var createSVG = document.createElementNS.bind(document, 'http://www.w3.org/2000/svg');

function el (query) {
  var clone = clones[query] || (clones[query] = createClone(query));
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

function createClone (query, svg) {
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

var text = document.createTextNode.bind(document);

function doMount (parent, child, before) {
  if (before) {
    parent.insertBefore(child, before.el || before);
  } else {
    parent.appendChild(child);
  }
}

function mount$1 (parent, child, before) {
  var parentEl = parent.el || parent;
  var type = child && child.constructor;

  if (type === String || type === Number) {
    doMount(parent, text(child), before);
    return true;
  } else if (type === Array) {
    for (var i = 0; i < child.length; i++) {
      mount$1(parent, child[i], before);
    }
    return true;
  } else if (child.nodeType) {
    var childEl = child.el || child;

    doMount(parent, child, before);
    return true;
  }
  return false;
}

var clones$1 = {};

function svg (query) {
  var clone = clones$1[query] || (clones$1[query] = createClone(query, true));
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
      } else {
        element.setAttribute(attr, arg[attr]);
      }
    }
  }

  return element;
}

svg.extend = function (query) {
  return svg.bind(this, query);
}

exports.el = el;
exports.createClone = createClone;
exports.mount = mount$1;
exports.text = text;
exports.svg = svg;

Object.defineProperty(exports, '__esModule', { value: true });

})));