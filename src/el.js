import { extend } from './extend';

var cached = {};

export function el (tagName) {
  return cached[tagName] || (cached[tagName] = extend.bind(document.createElement(tagName)));
}
