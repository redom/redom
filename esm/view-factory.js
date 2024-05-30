export function viewFactory(views, key) {
  if (!views || typeof views !== "object") {
    throw new Error("views must be an object");
  }
  if (!key || typeof key !== "string") {
    throw new Error("key must be a string");
  }
  return function (initData, item, i, data) {
    const viewKey = item[key];
    const View = views[viewKey];

    if (View) {
      return new View(initData, item, i, data);
    } else {
      throw new Error(`view ${viewKey} not found`);
    }
  };
}
