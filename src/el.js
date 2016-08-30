
import { expand, createElement } from './expand';

var domContext = {
  cache: {},
  expand: expand,
  createElement: createElement,
  allowBareProps: true,

  createTag: function (tag) {
    return document.createElement(tag);
  }
};

export function el (query, a, b, c, d, e, f) {
  var len = arguments.length;
  var args;

  if (len === 0) throw new Error('Must pass a query or a component!');

  if (len > 7) {
    args = new Array(len);
    for (var i = 0; i < len; i++) {
      args[i] = arguments[i];
    }
  }

  if (typeof query === 'function') {
    return len === 1 ? new query()
         : len === 2 ? new query(a)
         : len === 3 ? new query(a, b)
         : len === 4 ? new query(a, b, c)
         : len === 5 ? new query(a, b, c, d)
         : len === 6 ? new query(a, b, c, d, e)
         : len === 7 ? new query(a, b, c, d, e, f)
         : new (query.bind.apply(query, args));
  }

  var element = domContext.createElement(query);

  return len === 1 ? domContext.expand(element)
       : len === 2 ? domContext.expand(element, a)
       : len === 3 ? domContext.expand(element, a, b)
       : len === 4 ? domContext.expand(element, a, b, c)
       : len === 5 ? domContext.expand(element, a, b, c, d)
       : len === 6 ? domContext.expand(element, a, b, c, d, e)
       : len === 7 ? domContext.expand(element, a, b, c, d, e, f)
       : (args[0] = element, expand.apply(this, args));
}

el.extend = function (query) {
  return expand.bind(domContext, domContext.createElement(query));
}
