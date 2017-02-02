
var test = require('tape');

var SVGElement = window.SVGElement;
var CustomEvent = window.CustomEvent;

module.exports = function (redom) {
  var { el, list, router, svg, mount, unmount, setChildren, setAttr, setStyle } = redom;

  test('exports utils', function (t) {
    t.plan(2);
    t.ok(setAttr != null);
    t.ok(setStyle != null);
  });

  test('element creation', function (t) {
    t.test('without tagName', function (t) {
      t.plan(1);
      var div = el('');
      t.equals(div.outerHTML, '<div></div>');
    });
    t.test('just tagName', function (t) {
      t.plan(1);
      var hello = el('p', 'Hello world!');
      t.equals(hello.outerHTML, '<p>Hello world!</p>');
    });
    t.test('one class', function (t) {
      t.plan(1);
      var hello = el('p.hello', 'Hello world!');
      t.equals(hello.outerHTML, '<p class="hello">Hello world!</p>');
    });
    t.test('multiple class', function (t) {
      t.plan(1);
      var hello = el('p.hello.world', 'Hello world!');
      t.equals(hello.outerHTML, '<p class="hello world">Hello world!</p>');
    });
    t.test('append text', function (t) {
      t.plan(1);
      var hello = el('p', 'Hello', ' ', 'world!');
      t.equals(hello.outerHTML, '<p>Hello world!</p>');
    });
    t.test('ID', function (t) {
      t.plan(1);
      var hello = el('p#hello', 'Hello world!');
      t.equals(hello.outerHTML, '<p id="hello">Hello world!</p>');
    });
    t.test('styles with object', function (t) {
      t.plan(1);
      var hello = el('p', { style: { color: 'red' } });
      t.equals(hello.outerHTML, '<p style="color: red;"></p>');
    });
    t.test('styles with String', function (t) {
      t.plan(1);
      var hello = el('p', { style: 'color: red;' });
      t.equals(hello.outerHTML, '<p style="color: red;"></p>');
    });
    t.test('event handlers', function (t) {
      t.plan(1);
      var hello = el('p', { onclick: e => t.pass() }, 'Hello world!');
      hello.click();
    });
    t.test('attributes', function (t) {
      t.plan(1);
      var hello = el('p', { foo: 'bar' }, 'Hello world!');
      t.equals(hello.outerHTML, '<p foo="bar">Hello world!</p>');
    });
    t.test('children', function (t) {
      t.plan(1);
      var app = el('app',
        el('h1', 'Hello world!')
      );
      t.equals(app.outerHTML, '<app><h1>Hello world!</h1></app>');
    });
    t.test('child views', function (t) {
      t.plan(1);
      function Test () {
        this.el = el('test');
      }
      var app = el('app',
        new Test()
      );
      t.equals(app.outerHTML, '<app><test></test></app>');
    });
    t.test('array', function (t) {
      t.plan(1);
      var ul = el('ul',
        [1, 2, 3].map(function (i) {
          return el('li', i);
        })
      );
      t.equals(ul.outerHTML, '<ul><li>1</li><li>2</li><li>3</li></ul>');
    });
    t.test('middleware', function (t) {
      t.plan(1);
      var app = el('app',
        function (el) {
          el.setAttribute('ok', '!');
        },
        el('h1', 'Hello world!')
      );
      t.equals(app.outerHTML, '<app ok="!"><h1>Hello world!</h1></app>');
    });
    t.test('extend cached', function (t) {
      t.plan(1);

      var H1 = el.extend('h1');
      var h1 = H1('Hello world!');

      t.equals(h1.outerHTML, '<h1>Hello world!</h1>');
    });
    t.test('extend', function (t) {
      t.plan(1);

      var H2 = el.extend('h2');
      var h2 = H2('Hello world!');

      t.equals(h2.outerHTML, '<h2>Hello world!</h2>');
    });
    t.test('lifecycle events', function (t) {
      t.plan(1);
      var eventsFired = {
        mount: false,
        mounted: false,
        remount: false,
        remounted: false,
        unmount: false,
        unmounted: false
      };
      function Item () {
        this.el = el('p');
        this.mount = function () {
          eventsFired.mount = true;
        };
        this.mounted = function () {
          eventsFired.mounted = true;
        };
        this.remount = function () {
          eventsFired.remount = true;
        };
        this.remounted = function () {
          eventsFired.remounted = true;
        };
        this.unmount = function () {
          eventsFired.unmount = true;
        };
        this.unmounted = function () {
          eventsFired.unmounted = true;
        };
      }
      var item = new Item();
      mount(document.body, item);
      mount(document.body, item.el); // test view lookup (__redom_view)
      unmount(document.body, item);
      t.deepEqual(eventsFired, {
        mount: true,
        mounted: true,
        remount: true,
        remounted: true,
        unmount: true,
        unmounted: true
      });
    });
    t.test('setChildren', function (t) {
      t.plan(2);
      var h1 = el.extend('h1');
      var a = h1('a');
      var b = h1('b');
      setChildren(document.body, [
        a,
        b
      ]);
      t.equals(document.body.innerHTML, '<h1>a</h1><h1>b</h1>');
      setChildren(document.body, a);
      t.equals(document.body.innerHTML, '<h1>a</h1>');
    });
    t.test('throw error when no arguments', function (t) {
      t.plan(1);
      t.throws(el, new Error('At least one argument required'));
    });
  });

  test('list', function (t) {
    t.test('without key', function (t) {
      t.plan(1);

      function Item () {
        this.el = el('li');
        this.update = data => {
          this.el.textContent = data;
        };
      }

      var items = list('ul', Item);
      items.update(); // empty list
      items.update([1, 2, 3]);
      t.equals(items.el.outerHTML, '<ul><li>1</li><li>2</li><li>3</li></ul>');
    });
    t.test('element parent', function (t) {
      t.plan(1);

      function Item () {
        this.el = el('li');
        this.update = data => {
          this.el.textContent = data;
        };
      }

      var items = list(el('ul'), Item);
      items.update(); // empty list
      items.update([1, 2, 3]);
      t.equals(items.el.outerHTML, '<ul><li>1</li><li>2</li><li>3</li></ul>');
    });
    t.test('component parent', function (t) {
      t.plan(1);

      function Ul () {
        this.el = el('ul');
      }

      function Item () {
        this.el = el('li');
        this.update = data => {
          this.el.textContent = data;
        };
      }

      var ul = new Ul();

      var items = list(ul, Item);
      items.update(); // empty list
      items.update([1, 2, 3]);
      t.equals(items.el.outerHTML, '<ul><li>1</li><li>2</li><li>3</li></ul>');
    });
    t.test('with key', function (t) {
      t.plan(4);

      function Item () {
        this.el = el('li');
        this.update = function (data) {
          this.el.textContent = data.id;
          if (this.data) {
            t.equals(this.data.id, data.id);
          }
          this.data = data;
        };
      }

      var items = list('ul', Item, 'id');

      items.update([{ id: 1 }, { id: 2 }, { id: 3 }]);
      t.equals(items.el.outerHTML, '<ul><li>1</li><li>2</li><li>3</li></ul>');
      items.update([{ id: 2 }, { id: 3 }, { id: 4 }]);
      t.equals(items.el.outerHTML, '<ul><li>2</li><li>3</li><li>4</li></ul>');
    });
    t.test('with function key', function (t) {
      t.plan(6);

      function Item () {
        this.el = el('li');
        this.update = (data) => {
          this.el.textContent = data.id;
          if (this.data) {
            t.equals(this.data.id, data.id);
          }
          this.data = data;
        };
        this.remounted = function () {
          t.pass();
        };
      }

      var items = list('ul', Item, item => item.id);

      items.update([{ id: 1 }, { id: 2 }, { id: 3 }]);
      t.equals(items.el.outerHTML, '<ul><li>1</li><li>2</li><li>3</li></ul>');
      items.update([{ id: 2 }, { id: 3 }, { id: 4 }]);
      t.equals(items.el.outerHTML, '<ul><li>2</li><li>3</li><li>4</li></ul>');
    });
    t.test('adding / removing', function (t) {
      t.plan(6);

      function Item () {
        this.el = el('li');
        this.update = (data) => {
          this.el.textContent = data;
        };
      }
      Item.prototype.mounted = function () {
        t.pass();
      };
      Item.prototype.unmounted = function () {
        t.pass();
      };

      var items = list('ul', Item);

      items.update([1]);
      t.equals(items.el.outerHTML, '<ul><li>1</li></ul>');
      items.update([1, 2]);
      t.equals(items.el.outerHTML, '<ul><li>1</li><li>2</li></ul>');
      items.update([2]);
      t.equals(items.el.outerHTML, '<ul><li>2</li></ul>');
    });
    t.test('extend', function (t) {
      t.plan(1);

      function Td () {
        this.el = el('td');
        this.update = function (data) {
          this.el.textContent = data;
        };
      }
      var Tr = list.extend('tr', Td);
      var Table = list.extend('table', Tr);

      var table = new Table();

      table.update([[ 1, 2, 3 ], [ 4, 5, 6 ], [ 7, 8, 9 ]]);
      t.equals(table.el.outerHTML, '<table><tr><td>1</td><td>2</td><td>3</td></tr><tr><td>4</td><td>5</td><td>6</td></tr><tr><td>7</td><td>8</td><td>9</td></tr></table>');
    });
    t.test('mount / unmount / remount', function (t) {
      t.plan(7);
      function Test () {
        this.el = el('test');
      }
      Test.prototype.mounted = function () {
        t.pass();
      };
      Test.prototype.remounted = function () {
        t.pass();
      };
      Test.prototype.unmounted = function () {
        t.pass();
      };
      var test = new Test();
      setChildren(document.body, []);
      mount(document.body, test);
      t.equals(document.body.outerHTML, '<body><test></test></body>');
      unmount(document.body, test.el);
      mount(document.body, test.el);
      mount(document.body, test.el);
      unmount(document.body, test);
      t.equals(document.body.outerHTML, '<body></body>');
    });
    t.test('special cases', function (t) {
      t.plan(1);
      function Td () {
        this.el = el('td');
      }
      Td.prototype.update = function (data) {
        this.el.textContent = data;
      };
      function Tr () {
        this.el = list('tr', Td);
      }
      Tr.prototype.update = function (data) {
        this.el.update(data);
      };
      function Table () {
        this.el = list('table', Tr);
      }
      Table.prototype.update = function (data) {
        this.el.update(data);
      };
      var table = new Table();
      table.update([[1, 2, 3]]);
      setChildren(document.body, []);
      mount(document.body, table);
      t.equals(document.body.innerHTML, '<table><tr><td>1</td><td>2</td><td>3</td></tr></table>');
    });
  });

  test('SVG', function (t) {
    t.test('creation', function (t) {
      t.plan(2);

      var circle = svg('circle');
      t.equals(circle instanceof SVGElement, true);
      t.equals(circle.outerHTML, '<circle></circle>');
    });
    t.test('one class', function (t) {
      t.plan(2);
      var circle = svg('circle.giraffe');
      t.equals(circle instanceof SVGElement, true);
      t.equals(circle.outerHTML, '<circle class="giraffe"></circle>');
    });
    t.test('multiple class', function (t) {
      t.plan(2);
      var circle = svg('circle.giraffe.dog');
      t.equals(circle instanceof SVGElement, true);
      t.equals(circle.outerHTML, '<circle class="giraffe dog"></circle>');
    });
    t.test('ID', function (t) {
      t.plan(2);
      var circle = svg('circle#monkey');
      t.equals(circle instanceof SVGElement, true);
      t.equals(circle.outerHTML, '<circle id="monkey"></circle>');
    });
    t.test('parameters', function (t) {
      t.plan(1);

      var circle = svg('circle', { cx: 1, cy: 2, r: 3 });
      t.equals(circle.outerHTML, '<circle cx="1" cy="2" r="3"></circle>');
    });
    t.test('event handler', function (t) {
      t.plan(1);

      var circle = svg('circle', { onclick: e => t.pass() });
      circle.dispatchEvent(new CustomEvent('click', {}));
    });
    t.test('CSS with String', function (t) {
      t.plan(1);

      var circle = svg('circle', { style: 'color: red;' });
      t.equals(circle.outerHTML, '<circle style="color: red;"></circle>');
    });
    t.test('CSS with Object', function (t) {
      t.plan(1);

      var circle = svg('circle', { style: { color: 'red' } });
      t.equals(circle.outerHTML, '<circle style="color: red;"></circle>');
    });
    t.test('with text', function (t) {
      t.plan(1);

      var text = svg('text', 'Hello!');
      t.equals(text.outerHTML, '<text>Hello!</text>');
    });
    t.test('append text', function (t) {
      t.plan(t);

      var text = svg('text', 'Hello', ' ', 'world!');
      t.equals(text.outerHTML, '<text>Hello world!</text>');
    });
    t.test('extend cached', function (t) {
      t.plan(1);

      var Circle = svg.extend('circle');
      var circle = new Circle();
      t.equals(circle.outerHTML, '<circle></circle>');
    });
    t.test('extend', function (t) {
      t.plan(1);

      var Line = svg.extend('line');
      var line = new Line();
      t.equals(line.outerHTML, '<line></line>');
    });
    t.test('children', function (t) {
      t.plan(1);

      var graphic = svg('svg',
        svg('circle', { cx: 1, cy: 2, r: 3 })
      );
      t.equals(graphic.outerHTML, '<svg><circle cx="1" cy="2" r="3"></circle></svg>');
    });
    t.test('child view', function (t) {
      t.plan(1);

      function Circle () {
        this.el = svg('circle', { cx: 1, cy: 2, r: 3 });
      }

      var graphic = svg('svg',
        new Circle()
      );
      t.equals(graphic.outerHTML, '<svg><circle cx="1" cy="2" r="3"></circle></svg>');
    });
    t.test('middleware', function (t) {
      t.plan(1);

      var graphic = svg('svg',
        function (svg) {
          svg.setAttribute('ok', '!');
        },
        svg('circle', { cx: 1, cy: 2, r: 3 })
      );
      t.equals(graphic.outerHTML, '<svg ok="!"><circle cx="1" cy="2" r="3"></circle></svg>');
    });
    t.test('throw error when no arguments', function (t) {
      t.plan(1);
      t.throws(svg, new Error('At least one argument required'));
    });
  });
  test('router', function (t) {
    t.plan(2);
    function A () {
      this.el = el('a');
    }
    A.prototype.update = function (val) {
      this.el.textContent = val;
    };

    function B () {
      this.el = el('b');
    }

    B.prototype.update = function (val) {
      this.el.textContent = val;
    };

    var _router = router('.test', {
      a: A,
      b: B
    });
    _router.update('a', 1);
    t.equals(_router.el.outerHTML, '<div class="test"><a>1</a></div>');
    _router.update('b', 2);
    t.equals(_router.el.outerHTML, '<div class="test"><b>2</b></div>');
  });
};
