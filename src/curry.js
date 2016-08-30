export function createElementCurry (single) {
  return function (a, b) {
    if (arguments.length === 2) {
      return function (el) {
        single(el, a, b);
      }
    } else {
      return function (el) {
        for (var key in a) {
          single(el, key, a[key]);
        }
      }
    }
  }
}
