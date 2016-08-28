export function extend () {
  var el = this.cloneNode(true);

  for (var i = 0; i < arguments.length; i++) {
    arguments[i](el);
  }

  return el;
}
