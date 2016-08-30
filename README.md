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

const hello = el('h1', 'Hello world!');

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

// Define component

const Login = view({
  init () {
    this.el = el('form',
      on({ submit: this.submit }),

      this.email = el('input', { type: 'email' }),
      this.pass = el('input', { type: 'pass' }),
      this.submit = el('button', { text: 'Sign in' })
    );
  },
  submit (e) {
    e.preventDefault();

    console.log(this.email.value, this.pass.value);
});

// init "app"

var login = el(Login);

// Mount to DOM

mount(document.body, login);

```
## Iteration / component example
```js
import { el, list, mount } from 'redom';

// Define components

const Cell = view({
  init () {
    this.el = el('td');
  },
  update (data) {
    this.el.textContent = data;
  }
});

const Row = view({
  init () {
    this.el = el('tr',
      this.cols = list(cell)
    );
  },
  update (data) {
    this.cols.update(data);    
  }
});

const Table = view({
  init () {
    this.el = el('table',
      el('tbody',
        this.rows = list(Row)
      )
    );
  },
  update (data) {
    this.rows.update(data.tbody);
  }
});

// Init the app

const app = el(Table);

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
