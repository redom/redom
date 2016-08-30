
export function view (proto) {
  return function (a, b, c) {
    var view = Object.create(proto);

    var len = arguments.length;

    switch (len) {
      case 0:
        proto.init.call(view);
        return view;
      case 1:
        proto.init.call(view, a);
        return view;
      case 2:
        proto.init.call(view, a, b);
        return view;
      case 3:
        proto.init.call(view, a, b, c);
        return view;
    }

    var args = new Array(len);
    var i = 0;
    while (i < len) {
      args[i] = arguments[++i];
    }

    proto.init.apply(view, args);

    return view;
  }
}
