/* global Node */

import { ensureEl } from './util.js';
import { setChildren } from './setchildren.js';

export function router (parent, Views, initData) {
  return new Router(parent, Views, initData);
}

export class Router {
  constructor (parent, Views, initData) {
    this.el = ensureEl(parent);
    this.Views = Views;
    this.initData = initData;
  }

  update (route, data) {
    if (route !== this.route) {
      const Views = this.Views;
      const View = Views[route];

      this.route = route;

      if (View && (View instanceof Node || View.el instanceof Node)) {
        this.view = View;
      } else {
        this.view = View && new View(this.initData, data);
      }

      setChildren(this.el, [this.view]);
    }
    this.view && this.view.update && this.view.update(data, route);
  }
}
