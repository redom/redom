import { el } from './el';
import { setChildren } from './setchildren';

export function router (parent, Views) {
  return new Router(parent, Views);
}

export class Router {
  constructor (parent, Views) {
    this.el = typeof parent === 'string' ? el(parent) : parent;
    this.Views = Views;
  }
  update (route, data) {
    if (route !== this.route) {
      const Views = this.Views;
      const View = Views[route];

      this.view = View && new View();
      this.route = route;

      setChildren(this.el, [ this.view ]);
    }
    this.view && this.view.update && this.view.update(data);
  }
}
