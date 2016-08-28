var SVG = 'http://www.w3.org/2000/svg';

import { extend } from './extend';

export function svg (tagName) {
  return cached[tagName] || (cached[tagName] = extend.bind(document.createElementNS(SVG, tagName)))
}
