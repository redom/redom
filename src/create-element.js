export function createElement (query, ns) {
  // query parsing magic by https://github.com/maciejhirsz

  var tag, id, className;

  var mode = 0;
  var start = 0;

  for (var i = 0, len = query.length; i <= len; i++) {
    var cp = i === len ? 0 : query.charCodeAt(i);

    //  cp === '#'     cp === '.'     nullterm
    if (cp === 0x23 || cp === 0x2E || cp === 0) {
      if (mode === 0) {
        tag = i  === 0 ? 'div'
            : cp === 0 ? query
            :            query.substring(start, i);
      } else {
        var slice = query.substring(start, i)
        if (mode === 1) {
          id = slice;
        } else if (className) {
          className += ' ' + slice;
        } else {
          className = slice;
        }
      }

      start = i + 1;
      mode = cp === 0x23 ? 1 : 2;
    }
  }
  if (ns) {
    var element = document.createElementNS(ns, tag);
  } else {
    var element = document.createElement(tag);
  }

  if (id) element.id = id;
  if (className) element.className = className;

  return element;
}
