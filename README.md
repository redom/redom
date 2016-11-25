[![js-semistandard-style](https://img.shields.io/badge/code%20style-semistandard-brightgreen.svg?style=flat-square)](https://github.com/Flet/semistandard)
[![Build Status](https://img.shields.io/travis/pakastin/redom.svg?maxAge=3600&style=flat-square)](https://travis-ci.org/pakastin/redom)
[![npm](https://img.shields.io/npm/v/redom.svg?maxAge=3600&style=flat-square)](https://www.npmjs.com/package/redom)
[![npm](https://img.shields.io/npm/l/redom.svg?maxAge=3600&style=flat-square)](https://github.com/pakastin/redom/blob/master/LICENSE)
[![Twitter Follow](https://img.shields.io/twitter/follow/pakastin.svg?style=social&maxAge=3600)](https://twitter.com/pakastin)

# RE:DOM
Develop web apps with 100 % JavaScript and web standards.

![RE:DOM](https://redom.js.org/img/logo.svg)

## Hello RE:DOM
http://codepen.io/pakastin/pen/RGwoRg

## Performance
http://mathieuancelin.github.io/js-repaint-perfs/

## Quick start
Initialize RE:DOM projects easily with [RE:DOM project generator](https://github.com/pakastin/redom-cli)

## Installing
```
npm install redom
```

## Usage (ES2015 import)
```js
import { el, mount } from 'redom';

const hello = el('h1', 'Hello world!');

mount(document.body, hello);
```

## Using with commonjs
```js
const { el, mount } = require('redom');
```

## Oldskool
```html
<!DOCTYPE html>
<html>
  <body>
    <script src="https://redom.js.org/redom.min.js"></script>
    <script>
      var el = redom.el;
      var mount = redom.mount;

      // create HTML element
      var hello = el('h1', 'Hello world!');

      // mount to DOM
      mount(document.body, hello);
    </script>
  </body>
</html>
```

## Examples
Check out some examples on https://redom.js.org

## API
### el(query, ...properties/attributes/children/text)
You can create HTML elements just by providing query + as many properties/attributes objects, children and text as you want in any order. Examples:
```js
el('h1', 'Hello world!');
el('h1', { class: 'hello' }, 'Hello world!');
el('h1', 'Hello ', { class: 'hello' }, 'world!');
el('h1', { onclick: onclick }, 'Hello world, click me!');
el('h1.hello', 'Hello world!');
```
### el.extend(query)
You can predefine elements by extending them:
```js
const h1 = el.extend('h1.heading1');

h1('Hello world!');
```
### svg(query, ...properties/attributes/children/text)
Just like el, but with SVG elements.
### svg.extend(query)
Just like el.extend, but with SVG elements.
### text(text)
Create text node. Useful for updating parts of the text:
```js
// define view
class HelloView {
  constructor () {
    this.el = el('h1',
      'Hello ', 
      this.target = text('world'), 
      '!'
    );
  }
  update (data) {
    this.target.textContent = data;
  }
}
// create view
const hello = new HelloView();

// mount to DOM
mount(document.body, hello);

// update the view
hello.update('you');
```
### list(parentQuery, childView, key, initData)
List element is a powerful helper, which keeps it's child views updated with the data.
```js
class Li {
  constructor () {
    this.el = el('li');
  }
  update (data) {
    this.el.textContent = data;
  }
}

const ul = list('ul', Li);

mount(document.body, ul)

ul.update([ 1, 2, 3 ].map(i => 'Item ' + i);
```
When you provide a key, list will synchronize elements by their keys.
```js
class Li {
  constructor () {
    this.el = el('li');
  }
  update (data) {
    this.el.textContent = data.title;
  }
}

const ul = list('ul', Li, 'id');

mount(document.body, ul);

ul.update([ 1, 2, 3 ].map(i => {
  return {
    id: i,
    title: 'Item ' + i)
  };
});
```
### list.extend(parentQuery, childView, key, initData)
You can also extend lists, which can be useful i.e. with tables:
```js
// define component
class Td {
  constructor () {
    this.el = el('td');
  }
  update (data) {
    this.el.textContent = data;
  }
}

// define list components
const Tr = list.extend('tr', Td);
const Table = list.extend('table', Tr);

// create main view
const table = new Table;

// mount to DOM
mount(document.body, table);

// update the app
table.update([
  [ 1, 2, 3 ],
  [ 4, 5, 6 ],
  [ 7, 8, 9 ]
]);
```
### router(parent, Views)
Switch between views easily.
```js
class A {
  constructor () {
    this.el = el('.a');
  }
  update (data) {
    this.el.textContent = data.val;
  }
}
class B {
  constructor () {
    this.el = el('.b');
  }
  update (data) {
    this.el.textContent = data.val;
  }
}
const contentViews = {
  a: A,
  b: B
}
class App {
  constructor () {
    this.el = el('.app',
      this.content = router('.content', contentViews)
    );
  }
  update ({ section, data }) {
    this.content.update(section, data);
  }
}
const app = new App();

app.update('a', { val: 1 });

setTimeout(() => {
  app.update('b', { val: 2 });
}, 1000);
```
### setChildren(parent, children)
Little helper to update element's/view's children:
```js
const ul = el('ul');
const li = el('li', 'Item 1');
const li2 = el('li', 'Item 2');
const li3 = el('li', 'Item 3');

setChildren(ul, [ li, li2, li3 ]);

mount(document.body, ul);
```

## Browser support
### Short answer
IE 9 and up + all modern browsers
### Long answer
If you don't use `el.extend`, `svg.extend` or `list.extend` it'll work with <IE9 as well.

## Share the love with Stickermule stickers! ❤️
https://www.stickermule.com/marketplace/15681-re-dom

You can get $10 off from your order with [this link](https://www.stickermule.com/unlock?ref_id=7457070701)

## License
[MIT](https://github.com/pakastin/redom/blob/master/LICENSE)
