# RE:DOM
Tiny DOM library

![RE:DOM!](https://redom.js.org/meme.jpg)

## Installation
```
npm install redom
```

## Usage (ES2015 import)
```js
import { el, mount } from 'redom';

const h1 = el.extend('h1');

const hello = h1('Hello world!');

mount(document.body, hello);
```

## Using with commonjs
```js
var redom = require('redom');
var el = redom.el;
var mount = redom.mount;
```

## Oldskool
```html
<script src="https://redom.js.org/redom.min.js"></script>
```
```js
var el = redom.el;
var mount = redom.mount;
```

## Login example
```js
import { el, view, on, mount } from 'redom';

// Define element tags

const form = el.extend('form');
const input = el.extend('input');
const button = el.extend('button');

// Define component

const login = view({
  init () {
    this.el = form(
      on({ submit: this.submit }),

      this.email = input({ type: 'email' }),
      this.pass = input({ type: 'pass' }),
      this.submit = button({ text: 'Sign in' })
    );
  },
  submit (e) {
    e.preventDefault();

    console.log(this.email.value, this.pass.value);
});

// Mount to DOM

mount(document.body, login());

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

const cell = view({
  init () {
    this.el = td();
  },
  update (data) {
    this.el.textContent = data;
  }
});

const row = view({
  init () {
    this.el = tr(
      this.cols = list(cell)
    );
  },
  update (data) {
    this.cols.update(data);    
  }
});

const tableApp = view({
  init () {
    this.el = table(
      tbody(
        this.rows = list(row)
      )
    );
  },
  update (data) {
    this.rows.update(data.tbody);
  }
});

// Init the app

const app = tableApp();

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

## License
[MIT](https://github.com/pakastin/redom/blob/master/LICENSE)
