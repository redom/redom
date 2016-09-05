var test = require('tape');

module.exports = function (redom) {
  test('element creation', function (t) {
    t.plan(1);
    var hello = redom.el('p.hello', 'Hello world!');
    t.equals(hello.outerHTML, '<p class="hello">Hello world!</p>');
  });
};
