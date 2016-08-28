export function id (id) {
  return function (el) {
    el.setAttribute('id', id);
  }
}
