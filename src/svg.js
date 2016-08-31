
import { expand, createElement } from './expand';

var svgContext = {
  cache: {},
  expand: expand,
  createElement: createElement,
  allowBareProps: false,
  allowComponents: false,

  createTag: function (tag) {
    return document.createElementNS('http://www.w3.org/2000/svg', tag);
  }
};

export function svg (query) {
  var element = svgContext.createElement(query).cloneNode(false);
  var empty = true;

  for (var i = 1; i < arguments.length; i++) {
    empty = svgContext.expand(element, arguments[i], empty);
  }

  return element;
}

svg.extend = function (query) {
  var templateElement = svgContext.createElement(query);

  return function() {
    var element = templateElement.cloneNode(false);
    var empty = true;

    for (var i = 0; i < arguments.length; i++) {
      empty = svgContext.expand(element, arguments[i], empty);
    }

    return element;
  }
}
