
export function view (proto) {
  return function () {
    var view = Object.create(proto);

    var args = new Array(arguments.length);

    for (var i = 0; i < args.length; i++) {
      args[i] = arguments[i];
    }

    proto.init.apply(view, args);

    return view;
  }
}
