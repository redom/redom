
import { expand, createElement } from './expand';

var htmlContext = {
  cache: {},
  expand: expand,
  createElement: createElement,
  allowBareProps: true,
  allowComponents: true,

  createTag: function (tag) {
    return document.createElement(tag);
  }
};

export function el (query, a, b, c) {
  if (typeof query === 'function') {
    var len = arguments.length;

    switch (len) {
      case 1: return new query();
      case 2: return new query(a);
      case 3: return new query(a, b);
      case 4: return new query(a, b, c);
    }

    var args = new Array(len);
    while (len--) args[len] = arguments[len];

    return new (query.bind.apply(query, args));
  }

  var element = htmlContext.createElement(query).cloneNode(false);
  var empty = true;

  for (var i = 1; i < arguments.length; i++) {
    empty = htmlContext.expand(element, arguments[i], empty);
  }

  return element;
}

// export var el = expand.bind(htmlContext);

el.extend = function (query) {
  var templateElement = htmlContext.createElement(query);

  return function() {
    var element = templateElement.cloneNode(false);
    var empty = true;

    for (var i = 0; i < arguments.length; i++) {
      empty = htmlContext.expand(element, arguments[i], empty);
    }

    return element;
  }
}

// el.extend = function (query) {
//   return expand.bind(htmlContext, htmlContext.createElement(query));
// }
