export function className (className) {
  return function (el) {
    el.className = className;
  }
}
export function classList (classes) {
  return function (el) {
    for (var className in classes) {
      if (classes[className]) {
        el.classList.add(className);
      } else {
        el.classList.remove(className);
      }
    }
  }
}

export function setClassList (el, classes) {
  return classList(classes)(el);
}
