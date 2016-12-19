[![js-semistandard-style](https://img.shields.io/badge/code%20style-semistandard-brightgreen.svg?maxAge=3600&style=flat-square)](https://github.com/Flet/semistandard)
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

## State handling example
https://pakastin.github.io/redom-state

## [Introduction](https://github.com/pakastin/redom/wiki/1.-Introduction)
## [API](https://github.com/pakastin/redom/wiki/2.-API)

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
