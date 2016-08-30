
export function view (proto) {
  return function (a, b, c, d) {
    var view = Object.create(proto);
    var len = arguments.length;

    switch (len) {
      case 0: proto.init(); break;
      case 1: proto.init(a); break;
      case 2: proto.init(a, b); break;
      case 3: proto.init(a, b, c); break;
      default:
        var args = new Array(len);
        var i = 0;
        while (i < len) {
          proto.init.apply(this, args);
        }
      break;
    }
    
    return view;
  }
}
