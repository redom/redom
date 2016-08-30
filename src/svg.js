
import { expand, createElement } from './expand';

var svgContext = {
  cache: {},
  expand: expand,
  createElement: createElement,
  allowBareProps: false,

  createTag: function (tag) {
    return document.createElementNS('http://www.w3.org/2000/svg', tag);
  }
};

export function svg (query, a, b, c, d, e, f) {
  var len = arguments.length;
  var args;

  if (len === 0) throw new Error('Must pass a query!');

  if (len > 7) {
    args = new Array(len);
    for (var i = 0; i < len; i++) {
      args[i] = arguments[i];
    }
  }

  var element = svgContext.createElement(query);

  return len === 1 ? svgContext.expand(element)
       : len === 2 ? svgContext.expand(element, a)
       : len === 3 ? svgContext.expand(element, a, b)
       : len === 4 ? svgContext.expand(element, a, b, c)
       : len === 5 ? svgContext.expand(element, a, b, c, d)
       : len === 6 ? svgContext.expand(element, a, b, c, d, e)
       : len === 7 ? svgContext.expand(element, a, b, c, d, e, f)
       : (args[0] = element, expand.apply(this, args));
}

svg.extend = function (query) {
  return expand.bind(this, svgContext.createElement(query));
}
