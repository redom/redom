
import { expand, createElement } from './expand';

var domContext = {
  cache: {},
  expand: expand,
  createElement: createElement,
  allowBareProps: true,
  allowComponents: true,

  createTag: function (tag) {
    return document.createElement(tag);
  }
};

export function el (query) {
  if (typeof query === 'function') {
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
  }

  var element = domContext.createElement(query).cloneNode(false);
  var empty = true;

  for (var i = 1; i < arguments.length; i++) {
    empty = domContext.expand(element, arguments[i], empty);
  }

  return element;
}

// export var el = expand.bind(domContext);

el.extend = function (query) {
  var templateElement = domContext.createElement(query);

  return function() {
    var element = templateElement.cloneNode(false);
    var empty = true;

    for (var i = 0; i < arguments.length; i++) {
      empty = domContext.expand(element, arguments[i], empty);
    }

    return element;
  }
}

// el.extend = function (query) {
//   return expand.bind(domContext, domContext.createElement(query));
// }
