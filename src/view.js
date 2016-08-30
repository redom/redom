
export function view (proto) {
  return function (a, b, c, d) {
    var view = Object.create(proto);
    var len = arguments.length;

    switch (len) {
      case 0: proto.init.call(view); break;
      case 1: proto.init.call(view, a); break;
      case 2: proto.init.call(view, a, b); break;
      case 3: proto.init.call(view, a, b, c); break;
      
      default:
        var args = new Array(len);
        var i = 0;
        while (i < len) {
          proto.init.apply(view, args);
        }
      break;
    }

    return view;
  }
}
