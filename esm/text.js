export function text(str) {
  return document.createTextNode(str != null ? str : "");
}
