
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

export var svg = expand.bind(svgContext);

svg.extend = function (query) {
  return expand.bind(this, svgContext.createElement(query));
}
