var test = require('tape');

module.exports = function (redom) {
  var { el, list } = redom;

  test('element creation', function (t) {
    t.plan(1);
    var hello = el('p.hello', 'Hello world!');
    t.equals(hello.outerHTML, '<p class="hello">Hello world!</p>');
  });

  test('updating list twice', function (t) {
    t.plan(2);

    function Item() {
      this.el = el('li');
      this.update = (data) => {
        this.el.textContent = data;
      }
    }

    var items = list('ul', Item);

    items.update([1, 2, 3]);
    t.equals(items.el.outerHTML, "<ul><li>1</li><li>2</li><li>3</li></ul>");
    items.update([1]);
    t.equals(items.el.outerHTML, "<ul><li>1</li></ul>");
  });
};
