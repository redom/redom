
export function view (proto) {
  return function () {
    var view = Object.create(proto);

    var len = arguments.length;

    if (!len) {
      proto.init.call(view);
      return view;
    }

    var args = new Array(len);

    for (var i = 0; i < len; i++) {
      args[i] = arguments[i];
    }

    proto.init.apply(view, args);

    return view;
  }
}
