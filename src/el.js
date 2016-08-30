
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

export var el = expand.bind(domContext);

el.extend = function (query) {
  return expand.bind(domContext, domContext.createElement(query));
}
