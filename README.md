# RE:DOM
Tiny DOM library

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

## What can you do?
Documentation is a bit lacking yet, please check out the source for now: https://github.com/pakastin/redom/tree/master/src
