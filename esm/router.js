/* global Node */

import { ensureEl } from "./util.js";
import { setChildren } from "./setchildren.js";

export function router(parent, views, initData) {
  return new Router(parent, views, initData);
}

export class Router {
  constructor(parent, views, initData) {
    this.el = ensureEl(parent);
    this.views = views;
    this.Views = views; // backwards compatibility
    this.initData = initData;
  }

  update(route, data) {
    if (route !== this.route) {
      const views = this.views;
      const View = views[route];

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
