# RE:DOM
Tiny DOM library

![RE:DOM!](https://redom.js.org/meme.jpg)

## Installation
```
npm install redom
```

## Usage (ES2015 import)
```js
import { el, mount, text } from 'redom';

const h1 = el('h1');

const hello = h1(text('Hello world!'));

mount(document.body, hello);
```

## Using with commonjs
```js
var redom = require('redom');
var el = redom.el;
var mount = redom.mount;
var text = redom.text;
```

## Oldskool
```html
<script src="https://redom.js.org/redom.min.js"></script>
```
```js
var el = redom.el;
var mount = redom.mount;
var text = redom.text;
```

## Login example
```js
import { el, text, mount } from 'redom';
import { children, props, events } from 'redom';

// Define element tags

const form = el('form');
const input = el('input');
const button = el('button');

// Define component

const login = form(
  children(el => [
    el.email = input(props({ type: 'email' })),
    el.pass = input(props({ type: 'pass' })),
    el.submit = button(text('Sign in'))
  ]),
  events({
    onsubmit (el, e) {
      e.preventDefault();

      console.log(el.email.value, el.pass.value);
    }
  })
);

// Mount to DOM

mount(document.body, login);
```
## Iteration / component example
```js
import { el, list, mount } from 'redom';

// Define element tags

const table = el('table');
const tbody = el('tbody');
const tr = el('tr');
const td = el('td');

// Define components

const cell = (data) => td(
  update((el, data) => {
    el.textContent = data;
  })
)

const row = (data) => tr(
  children(el => [
    el.cols = list(el, cell)
  ]),
  update((el, data) => {
    el.cols.update(data)
  })
);

// Init the app

const app = table(
  children(el => [
    el.rows = list(tbody(), row)
  ]),
  update((el, data) => {
    el.rows.update(data.tbody)
  })
)

// Mount to DOM

mount(document.body, app);

// update app

app.update({
  tbody: [
    [ 1, 2, 3 ]
  ]
});
```
## What else can you do with RE:DOM?
Documentation is a bit lacking yet, please check out the source for now: https://github.com/pakastin/redom/tree/master/src

## Special thanks
Special thanks to [maciejhirsz](https://github.com/maciejhirsz) for [the bind trick](https://github.com/pakastin/frzr/issues/35#issuecomment-242936751)!

## License
[MIT](https://github.com/pakastin/redom/blob/master/LICENSE)
