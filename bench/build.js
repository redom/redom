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

function children (handler) {
  return function (el) {
    var _children = handler instanceof Array ? handler : handler(el);

    for (var i = 0; i < _children.length; i++) {
      var child = _children[i];

      if (child && child.nodeType) {
        el.appendChild(child);
      }
    }
  }
}

function className (className) {
  return function (el) {
    el.className = className;
  }
}

function extend () {
  var el = this.cloneNode(true);

  for (var i = 0; i < arguments.length; i++) {
    arguments[i](el);
  }

  return el;
}

var cached = {};

function el (tagName) {
  return cached[tagName] || (cached[tagName] = extend.bind(document.createElement(tagName)));
}

function text (text) {
  return function (el) {
    el.appendChild(document.createTextNode(text));
  }
}

var b = el('b');
var div = el('div');
var h1 = el('h1');
var p = el('p');

bench('REDOM <div> with multiple child nodes', function() {
    div(
        children([
            h1(className('redom'), text('Hello '), children([
                b(children([
                    text('RE:DOM')
                ]))

            ]), text('!')),
            p(
                text('Bacon ipsum dolor amet meatloaf meatball shank porchetta \
                    picanha bresaola short loin short ribs capicola fatback beef \
                    ribs corned beef ham hock.')
            )
        ])
    )
});


console.log('REDOM', div(
    children([
        h1(className('redom'), text('Hello '), children([
            b(children([
                text('RE:DOM')
            ]))

        ]), text('!')),
        p(
            text('Bacon ipsum dolor amet meatloaf meatball shank porchetta \
                picanha bresaola short loin short ribs capicola fatback beef \
                ribs corned beef ham hock.')
        )
    ])
));

}());