# RE:DOM documentation
<p class="violator solid"><a href="https://redom.js.org/">Website</a></p><p class="violator"><a href="https://github.com/redom/redom">GitHub</a></p>

## Introduction
RE:DOM is a tiny (2 KB) DOM library by [Juha Lindstedt](https://pakastin.fi) and [contributors](https://github.com/redom/redom/graphs/contributors), which adds some useful helpers to create DOM elements and keeping them in sync with the data.

Because RE:DOM is so close to the metal and __doesn't use virtual dom__, it's actually __faster__ and uses __less memory__ than almost all virtual dom based libraries, including React ([benchmark](http://www.stefankrause.net/js-frameworks-benchmark7/table.html)).

It's also easy to create __reusable components__ with RE:DOM.

Another great benefit is, that you can use just __pure JavaScript__, so no complicated templating languages to learn and hassle with.

### Browser support
Only if you use `el.extend()`, `svg.extend()` or `list.extend()`, you'll need at least IE9. All other features should work even in IE6. So for the most parts basically almost every browser out there is supported.

## Installing
There are many ways to use RE:DOM.

### npm
You can install RE:DOM from npm by calling:
```
npm i redom
```

### UMD
RE:DOM supports [UMD](https://github.com/umdjs/umd):
```html
<script src="https://redom.js.org/redom.min.js"></script>
<script>
  const { el, mount } = redom;
  ...
</script>
```

### ES2015
It's also possible to use the new [ES2015 import](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/import):
```js
import { el, mount } from 'https://redom.js.org/redom.es.min.js';
```

### Download
Here's the download links:
- https://redom.js.org/redom.js (UMD, development)
- https://redom.js.org/redom.min.js (UMD, production)
- https://redom.js.org/redom.es.js (ES2015, development)
- https://redom.js.org/redom.es.min.js (ES2015, production)

### Project generator
You can also use the project generator, which will also install a file watcher and bundler. You can find it [here](https://github.com/redom/redom-cli).

### Server-side use
RE:DOM also works on server side, by using [NO:DOM](https://github.com/redom/nodom).

### RE:DOM dev tools for Chrome
You can install [RE:DOM dev tools for Chrome](https://github.com/redom/redom-devtools)

## Elements

`el()` (actually an [alias](#alias) for [`html()`](https://github.com/redom/redom/blob/master/esm/html.js)) is a helper for `document.createElement()` with a couple of differences.

The basic idea is to simply create elements with `el()` and mount them with `mount()`, almost like you would do with plain JavaScript:
```js
import { el, mount } from 'redom';

const hello = el('h1', 'Hello RE:DOM!');

mount(document.body, hello);
```
```html
<body>
  <h1>Hello RE:DOM!</h1>
</body>
```

### Text reference
String and Number arguments (after the query) generate text nodes. You can also use the [`text()`](https://github.com/redom/redom/blob/master/esm/text.js) helper, which will return a reference to the text node:
```js
import { text, mount } from 'redom';

const hello = text('hello');

mount(document.body, hello);

hello.textContent = 'hi!';
```
```html
<body>hi!</body>
```
### ID and class names

You can use `#` and `.` as shortcuts for defining element IDs and class names. `div` is the default tag name:
```js
el('')
el('#hello')
el('.hello')
el('span.hello')
```
```html
<div></div>
<div id="hello"></div>
<div class="hello"></div>
<span class="hello"></span>
```

### Style
You can define styles with strings or objects:
```js
el('div', { style: 'color: red;' })
el('div', { style: { color: 'red' } })
```
```html
<div style="color: red;"></div>
<div style="color: red;"></div>
 ```

### Attributes and properties
Properties and attributes are auto-detected:
```js
el('input', { type: 'email', autofocus: true, value: 'foo' })
```
```html
<input type="email" autofocus> // $0.value === 'foo'
```

### Children
You can also define children while creating elements:

```js
el('a',
  el('b',
    el('c')
  )
)
```
```html
<a>
  <b>
    <c></c>
  </b>
</a>
```

### Array of children
Passing an array of children also works:

```js
el('a', [
  el('b'),
  el('c')
]);
```
```html
<a>
  <b></b>
  <c></c>
</a>
```

### Conditional children
It's possible to add children conditionally, by using boolean:
```js
el('form',
  el('input', { type: 'email' }),
  !forgot && el('input', { type: 'password' })
);
```

### Middleware
You can add middleware by defining a function:
```js
el('h1', middleware, 'Hello RE:DOM!');

function middleware (el) {
  el.className = 'hello';
}
```
```html
<h1 class="hello">Hello RE:DOM!</h1>
```
### Component support
You can read more about components [here](#components), but here's how you attach them:
```js
class B {
  constructor () {
    this.el = el('b');
  }
}

el('a',
  new B()
)
```
```html
<a>
  <b></b>
</a>
```

### Alias
You can use `el()` or `html()`:

```js
import { el, html } from 'redom';

el('div')
html('div')
```
```html
<div></div>
<div></div>
```

### SVG
`el()` and `html()` only create HTML elements. If you want to create a SVG element, you must use [`svg(query)`](https://github.com/redom/redom/blob/master/esm/svg.js):
```js
import { svg, mount } from 'redom';

const drawing = svg('svg',
  svg('symbol', { id: 'box', viewBox: '0 0 100 100' },
    svg('rect', { x: 25, y: 25, width: 50, height: 50 })
  ),
  svg('circle', { r: 50, cx: 25, cy: 25 }),
  svg('use', { xlink: { href: '#box' } })
);

mount(document.body, drawing);
```
```html
<body>
  <svg>
    <symbol id="box" viewBox="0 0 100 100">
      <rect x="25" y="25" width="50" height="50"></rect>
    </symbol>
    <circle r="50" cx="25" cy="25"></circle>
    <use xlink:href="#box"></use>
  </svg>
</body>
```

## Mounting
Please use `mount()`/`unmount()`/`setChildren()` every time you need to mount/unmount elements inside a RE:DOM app. These functions will trigger lifecycle events, add references to components etc.

### Mount
You can mount elements/components with [`mount(parent, child, /*opt.*/ before, /*opt.*/ replace)`](https://github.com/redom/redom/blob/master/esm/mount.js). If you omit the optional arguments, it works like [`appendChild()`](https://developer.mozilla.org/en-US/docs/Web/API/Node/appendChild). If you pass a `before` value, it works like [`insertBefore()`](https://developer.mozilla.org/en-US/docs/Web/API/Node/insertBefore). If you, additionally, pass `true` as the `replace` argument, it works like [`replaceChild()`](https://developer.mozilla.org/en-US/docs/Web/API/Node/replaceChild) (in this case, the name `before` can be viewed in a chronological manner).

The first time you mount a child, the `onmount` [lifecycle event](#component-lifecycle) will be triggered. If you mount the same child again to the same parent, `onremount` will be triggered. If you mount it to another place, `onunmount` and `onmount` will be triggered. Read more about lifecycle events [here](#component-lifecycle).

```js
import { el, mount } from 'redom';

const hello = el('h1', 'Hello RE:DOM!');

// append element:
mount(document.body, hello);

// insert before the first element:
mount(document.body, hello, document.body.firstChild);

// replace an existing element:
const revamped = el('h1', 'Revamped!');
mount(document.body, revamped, hello, true);
```

### Unmount
If you need to remove elements/components, use [`unmount(parent, child)`](https://github.com/redom/redom/blob/master/esm/unmount.js). That will trigger the `onunmount` [lifecycle event](#component-lifecycle):

```js
unmount(document.body, hello);
```

### Set children
RE:DOM uses [`setChildren(parent, ...children)`](https://github.com/redom/redom/blob/master/esm/setchildren.js) under the hood for [lists](#lists). When you call `setChildren()`, RE:DOM will add/reorder/remove elements/components automatically by reference:
```js
import { el, setChildren } from 'redom';

const a = el('a');
const b = el('b');
const c = el('c');

setChildren(document.body, [a, b, c]);
setChildren(document.body, [c, b]);
```
```html
<body>
  <c></c>
  <b></b>
</body>
```

For example, if you need to clear the document body, you can also use `setChildren(document.body, []);`.

There's also a shortcut for replacing children with a single component / element: `setChildren(document.body, app);`.

## Update elements

### setAttr
[`setAttr(el, attrs)`](https://github.com/redom/redom/blob/master/esm/setattr.js) is a helper for updating attributes and properties. It will auto-detect attributes and properties:
```js
import { el, setAttr } from 'redom';

const hello = el('h1', 'Hello RE:DOM!');

setAttr(hello, {
  style: { color: 'red' },
  className: 'hello' // You could also just use 'class'
});
```
### setStyle
[`setStyle(el, styles)`](https://github.com/redom/redom/blob/master/esm/setstyle.js) is a shortcut for updating the `style` attribute:
```js
import { setStyle } from 'redom';

setStyle(hello, { color: 'green' });
```

## Components
It's really easy to create components with RE:DOM.
Simply define a class or function, which returns an object with at least an `el` property, and in case of [list](#lists) also the `update` property:

```js
import { el, mount } from 'redom';

class Hello {
  constructor () {
    this.el = el('h1');
  }
  update (data) {
    this.el.textContent = 'Hello ' + data + '!';
  }
}

const hello = new Hello();

hello.update('RE:DOM!');

mount(document.body, hello);
```

### Diffing
You don't have to manually diff class names / properties / attributes __except when dealing with URLs__.
If you change the `src` of  `img`, `iframe` or `video` elements, the browser will __reload__ the asset/website even if the value did not actually change.
One way to work around this would be:

```js
import { el, mount } from 'redom';

class Image {
  constructor () {
    this.el = el('img');
    this.data = {};
  }
  update (data) {
    const { url } = data;

    if (url !== this.data.url) {
      this.el.src = url;
    }

    this.data = data;
  }
}
```

### Component lifecycle
RE:DOM supports true lifecycle events. Three events are defined: `onmount`, `onremount` and `onunmount`.

* The first time you mount an element to a specific parent, `onmount` will be triggered.
* If you mount an element again to the same parent, `onremount` will be triggered.
* If you unmount an element or move it from one parent to another, `onunmount` will be triggered.

This means that `onunmount` and `onmount` will be triggered in succession when moving an element from one parent to another.

```js
import { el, mount } from 'redom';

class Hello {
  constructor () {
    this.el = el('h1', 'Hello RE:DOM!');
  }
  onmount () {
    console.log('mounted Hello');
  }
  onremount () {
    console.log('remounted Hello');
  }
  onunmount () {
    console.log('unmounted Hello');
  }
}

class App {
  constructor () {
    this.el = el('app',
      this.hello = new Hello()
    );
  }
  onmount () {
    console.log('mounted App');
  }
  onremount () {
    console.log('remounted App');
  }
  onunmount () {
    console.log('unmounted App');
  }
}

const app = new App();

mount(document.body, app);
mount(document.body, app);
mount(document.head, app);
unmount(document.head, app);
```
```
mounted App
mounted Hello
remounted App
remounted Hello
unmounted App
unmounted Hello
mounted App
mounted Hello
unmounted App
unmounted Hello
```
## Lists
When you have dynamic data, it's not that easy to manually keep the elements and the data in sync.
That's when the [`list(parent, View, key, initData)`](https://github.com/redom/redom/blob/master/esm/list.js) helper comes to rescue.

To use `list()`, just define a parent node and component:
```js
import { el, list, mount } from 'redom';

class Li {
  constructor () {
    this.el = el('li');
  }
  update (data) {
    this.el.textContent = 'Item ' + data;
  }
}

const ul = list('ul', Li);

mount(document.body, ul);

ul.update([1, 2, 3]);
ul.update([2, 2, 4]);
```

### Item update parameters
`Item.update()` will be called with several parameters:

1. `data` &mdash; data of this item
2. `index` &mdash; index of this item in the items array
3. `items` &mdash; data of all items
4. `context` &mdash; contextual data forwarded from the second `List.update()` parameter

```js
import { el, list, mount } from 'redom';

class Li {
  constructor () {
    this.el = el('li');
  }
  update (data, index, items, context) {
    this.el.style.color = context.colors.accent
    this.el.textContent = '[' + index + '] = Item ' + data;
  }
}

const ul = list('ul', Li);

mount(document.body, ul);

ul.update([1, 2, 3], { colors: { accent: 'red' } });
```

### List lifecycle

When you call `List.update()`, the list will automatically:

- Create new components for new items
- Mount new components in the right place
- Reorder moved items (remount)
- Remove deleted items
- Trigger any [lifecycle](#component-lifecycle) events
- Call `.update()` for all components, except removed ones

### Keyed list
Normally `list()` will update by index, so it only adds/removes the last item.

If you want to define a key, you can do that by adding a third parameter to `list()`. With a key, the list will automatically insert/reorder/remove elements by that key of each object in the list.

```js
import { el, list, mount } from 'redom';

class Li {
  constructor () {
    this.el = el('li');
  }
  update (data) {
    this.el.textContent = data.name;
  }
}

const ul = list('ul', Li, '_id');

mount(document.body, ul);

ul.update([
  { _id: 1, name: 'Item 1' },
  { _id: 2, name: 'Item 2' },
  { _id: 3, name: 'Item 3' }
]);

setTimeout(() => {
  ul.update([
    { _id: 3, name: 'Item 3' },
    { _id: 2, name: 'Item 2' }
  ]);
}, 1000);
```

### List components

There's couple of ways to do a list component:

#### list.extend
```js
class Td {
  constructor () {
    this.el = el('td');
  }
  update (data) {
    this.el.textContent = data;
  }
}

const Tr = list.extend('tr', Td);

const table = el('table', Tr);

mount(document.body, table);
```

#### Regular component

```js
class Td {
  constructor () {
    this.el = el('td');
  }
  update (data) {
    this.el.textContent = data;
  }
}
class Tr {
  constructor () {
    this.el = list('tr', Td);
  }
  update (data) {
    this.el.update(data);
  }
}

const table = list('table', Tr);

mount(document.body, table);
```

This works, but in case you need to access `this.el.el` (`<tr>`) in `Tr`, I recommend to use the following:

```js
class Td {
  constructor () {
    this.el = el('td');
  }
  update (data) {
    this.el.textContent = data;
  }
}
class Tr {
  constructor () {
    this.el = el('tr');
    this.list = list(this.el, Td);
  }
  update (data) {
    this.list.update(data);
  }
}
const table = list('table', Tr);

mount(document.body, table);
```
or the other way around:
```js
this.list = list('tr', Td);
this.el = this.list.el;
```

## Place
Sometimes you might need to create/destroy a component/element while reserving it's place. That's when [`place(View, initData)`](https://github.com/redom/redom/blob/master/esm/place.js) come in handy!

Think of it as a single view [router](#router) (without the need of a parent).

```js
import { place, mount } from 'redom';
import { Top, Menu, Content } from './elements';

const app = el('.app',
  this.top = new Top(),
  this.menu = place(Menu),
  this.content = new Content()
);

// create Menu and send data update:
this.menu.update(true, data);

// just update Menu (was already created):
this.menu.update(true, data2);

// delete Menu:
this.menu.update(false);

```

When you call `place.update(visible, data)`, the `Place` will automatically detect what to do with the component:
- [construct](https://github.com/redom/redom/blob/master/esm/place.js#L25)
- [update](https://github.com/redom/redom/blob/master/esm/place.js#L33)
- [destroy](https://github.com/redom/redom/blob/master/esm/place.js#L40)

## Router
[`router(parent, routes, initData)`](https://github.com/redom/redom/blob/master/esm/router.js) is a component/element router, which will create/update/remove components/element based on the current route.

```js
import { router, mount } from 'redom';

import { Home, About, Contact } from './sections/index'

const app = router('.app', {
  home: Home,
  about: About,
  contact: Contact
});

mount(document.body, app);

app.update('home', data);
app.update('about', data);
```

The example will:
- create a `Home` component
- update it with `data`
- remove it
- create an `About` component
- update it with `data`
- call all defined [lifecycle events](#component-lifecycle)

## More examples
You can find more examples on the [RE:DOM website](https://redom.js.org)!

## Support / feedback
You're welcome to join  [#redom](https://koodiklinikka.slack.com/messages/redom/) @ [koodiklinikka.slack.com](koodiklinikka.slack.com) (get invitation by entering your email at [koodiklinikka.fi](https://koodiklinikka.fi)). If you have any questions / feedback, you can also raise an issue on [GitHub](https://github.com/redom/redom).

## Developing
RE:DOM is on [GitHub](https://github.com/redom/redom), source is [here](https://github.com/redom/redom/tree/master/esm). To start developing:
- Clone repository
- `npm i`
- `npm run dev`

Pull requests are more than welcome!

## License
[MIT](https://github.com/redom/redom/blob/master/LICENSE)

<p class="violator solid"><a href="https://redom.js.org/">Website</a></p><p class="violator"><a href="https://github.com/redom/redom">GitHub</a></p>
