export function dispatch(el, data, eventName = "redom") {
  const event = new CustomEvent(eventName, { bubbles: true, detail: data });
  el.dispatchEvent(event);
}
