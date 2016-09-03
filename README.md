# RE:DOM
Make DOM great again!

![RE:DOM!](https://redom.js.org/meme.jpg)

## Hello RE:DOM
http://codepen.io/pakastin/pen/RGwoRg

## Quick start
Initialize RE:DOM projects easily with [RE:DOM project generator](https://github.com/pakastin/redom-cli)
```
$ npm install -g redom-cli
$ redom
```

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

## Examples
Check out some examples on https://redom.js.org

## What else can you do with RE:DOM?
Documentation is a bit lacking yet, please check out the source for now: https://github.com/pakastin/redom/tree/master/src

You can also check out FRZR's documentation, which is quite like the old version of RE:DOM now and will probably be deprecated soon.. https://frzr.js.org

## License
[MIT](https://github.com/pakastin/redom/blob/master/LICENSE)
