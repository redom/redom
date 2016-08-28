export function text (text) {
  return function (el) {
    el.appendChild(document.createTextNode(text));
  }
}
