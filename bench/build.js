(function () {
'use strict';

function bench(name, iter) {
    console.log(`Benching ${name}`);

    var maxIterations = 1000000;
    var iterations = maxIterations;

    var start = performance.now();

    while (iterations--) iter();

    var totalNanos = (performance.now() - start) * 1e6;
    var average = totalNanos / maxIterations;
    var iterPerSec = 1e9 / average;


    console.log(`- ${Math.round(average)}ns per iteration (${iterPerSec | 0} ops/sec)`);
    console.log('');
}

var text = document.createTextNode.bind(document);

function setChildren (parent, children) {
  var parentEl = parent.el || parent;
  var traverse = parentEl.firstChild;

  for (var i = 0; i < children.length; i++) {
    var child = children[i];
    var childEl = child.el || child;

    if (childEl === traverse) {
      traverse = traverse.nextSibling;
      continue;
    }

    mount$1(parent, child);
  }

  while (traverse) {
    var next = traverse.nextSibling;
    parentEl.removeChild(traverse);
    traverse = next;
  }
}

function doMount (parent, child, before) {
  if (before) {
    parent.insertBefore(child, before.el || before);
  } else {
    parent.appendChild(child);
  }
}

function mount$1 (parent, child, before) {
  var parentEl = parent.el || parent;

  if (child == null) {
    return;
  }

  var childEl = child.el || child;

  if (typeof child === 'string' || typeof child === 'number') {
    doMount(parentEl, text(child), before);
    return true;
  } else if (child.views) {
    child.parent = parent;
    setChildren(parentEl, child.views);
    return true;
  } else if (child.length) {
    for (var i = 0; i < child.length; i++) {
      mount$1(parent, child[i], before);
    }
    return true;
  } else if (childEl.nodeType) {
    if (child !== childEl) {
      childEl.view = child;
    }
    if (childEl.mounted) {
      childEl.mounted = false;
      child.unmount && child.unmount();
      notifyUnmountDown(childEl);
    }
    doMount(parentEl, childEl, before);
    if (parentEl.mounted || document.contains(childEl)) {
      childEl.mounted = true;
      child.mount && child.mount();
      notifyMountDown(childEl);
    }
    return true;
  }
  return false;
}

function notifyMountDown (child) {
  var traverse = child.firstChild;

  while (traverse) {
    if (traverse.mounted) {
      return;
    }
    traverse.mounted = true;
    traverse.view && traverse.view.mount && traverse.view.mount();
    notifyMountDown(traverse);
    traverse = traverse.nextSibling;
  }
}

function notifyUnmountDown (child) {
  var traverse = child.firstChild;

  while (traverse) {
    if (!traverse.mounted) {
      return;
    }
    traverse.mounted = false;
    traverse.view && traverse.view.unmount && traverse.view.unmount();
    notifyUnmountDown(traverse);
    traverse = traverse.nextSibling;
  }
}

var cached = {};
var cachedSVG = {};

var createSVG = document.createElementNS.bind(document, 'http://www.w3.org/2000/svg');

function el (query, a, b, c, d, e, f) {
  var len = arguments.length;
  var args;

  if (len === 0) throw new Error('Must pass a query or a component!');

  if (len > 7) {
    args = new Array(len);
    for (var i = 0; i < len; i++) {
      args[i] = arguments[i];
    }
  }

  if (typeof query === 'function') {
    if (query.constructor) {
      // ?
    }

    return len === 1 ? new query()
         : len === 2 ? new query(a)
         : len === 3 ? new query(a, b)
         : len === 4 ? new query(a, b, c)
         : len === 5 ? new query(a, b, c, d)
         : len === 6 ? new query(a, b, c, d, e)
         : len === 7 ? new query(a, b, c, d, e, f)
         : new (query.bind.apply(query, args));
  }

  var element = createElement(query);

  return len === 1 ? expand(element)
       : len === 2 ? expand(element, a)
       : len === 3 ? expand(element, a, b)
       : len === 4 ? expand(element, a, b, c)
       : len === 5 ? expand(element, a, b, c, d)
       : len === 6 ? expand(element, a, b, c, d, e)
       : len === 7 ? expand(element, a, b, c, d, e, f)
       : args[0] = element, expand.apply(this, args);
}

function expand (templateElement) {
  var element = templateElement.cloneNode(false);
  var empty = true;

  for (var i = 1; i < arguments.length; i++) {
    var arg = arguments[i];

    if (arg == null) continue;

    if (typeof arg === 'function') {
      arg = arg(element);
    }

    if (empty && (typeof arg === 'string' || typeof arg === 'number')) {
      element.textContent = arg;
      empty = false;
      continue;
    }

    if (mount$1(element, arg)) {
      empty = false;
      continue;
    }

    if (typeof arg === 'object') {
      for (var attr in arg) {
        var value = arg[attr];

        if (attr === 'style') {
          if (typeof value === 'string') {
            element.setAttribute(attr, value);
          } else {
            var elementStyle = element.style;

            for (var key in value) {
              elementStyle[key] = value[key];
            }
          }
        } else if (attr in element) {
          element[attr] = arg[attr];
        } else {
          element.setAttribute(attr, arg[attr]);
        }
      }
    }
  }

  return element;
}

el.extend = function (query) {
  return expand.bind(this, createElement(query));
}

function createElement (query, svg) {
  var cache = svg ? cachedSVG : cached;

  if (query in cached) return cache[query];

  // query parsing magic by https://github.com/maciejhirsz

  var tag, id, className;

  var mode = 0;
  var from = 0;

  for (var i = 0, len = query.length; i <= len; i++) {
    var cp = i === len ? 0 : query.charCodeAt(i);

    //  cp === '#'     cp === '.'     nullterm
    if (cp === 0x23 || cp === 0x2E || cp === 0) {
      if (mode === 0) {
        tag = i  === 0 ? 'div'
            : cp === 0 ? query
            :            query.substring(from, i);
      } else {
        var slice = query.substring(from, i)
        if (mode === 1) {
          id = slice;
        } else if (className) {
          className += ' ' + slice;
        } else {
          className = slice;
        }
      }

      from = i + 1;
      mode = cp === 0x23 ? 1 : 2;
    }
  }

  var el = svg ? createSVG(tag) : document.createElement(tag);

  id && (el.id = id);
  className && (el.className = className);

  return cache[query] = el;
}

var div = el.extend('div');
var redomH1 = el.extend('h1.redom');
var b = el.extend('b');
var p = el.extend('p');

bench('REDOM <div> with multiple child nodes', function() {
    div(
        redomH1('Hello ', b('RE:DOM'), '!'),
        p(
            'Bacon ipsum dolor amet meatloaf meatball shank porchetta \
             picanha bresaola short loin short ribs capicola fatback beef \
             ribs corned beef ham hock.'
        )
    )
});

console.log('REDOM',
    div(
        redomH1('Hello ', b('RE:DOM'), '!'),
        p(
            'Bacon ipsum dolor amet meatloaf meatball shank porchetta \
             picanha bresaola short loin short ribs capicola fatback beef \
             ribs corned beef ham hock.'
        )
    )
);

}());