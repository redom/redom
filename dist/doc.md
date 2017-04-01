# RE:DOM documentation

## Introduction
RE:DOM is a tiny DOM library by [Juha Lindstedt](https://pakastin.fi) and [contributors](https://github.com/pakastin/redom/graphs/contributors), which adds some useful helpers to create DOM elements and keeping them in sync with the data.

Because RE:DOM is so close to the metal and __doesn't use virtual dom__, it's actually __faster__ and uses __less memory__ than almost all virtual dom based libraries, including React.

It's also easy to create __reusable components__ with RE:DOM.

Another great benefit is, that you can use just __pure JavaScript__, so no complicated templating languages to learn and hassle with.

### Browser support
Only if you use `el.extend`, `svg.extend` or `list.extend`, you'll need at least IE9. All other features should work even in IE6. So for the most parts basically almost every browser out there is supported.

## Installing
You can install RE:DOM from npm by calling:
```
npm i redom
```

RE:DOM also supports [UMD](https://github.com/umdjs/umd):
```html
<script src="https://redom.js.org/redom.min.js"></script>
```
### Project generator
You can also use the project generator, which will also install a file watcher and bundler. You can find it [here](https://github.com/pakastin/redom-cli).

### Server-side use
RE:DOM also works on server side, by using [NO:DOM](https://github.com/pakastin/nodom).

## Elements

`el` ([alias](#alias): `html`) is a helper for `document.createElement` with couple of differences.

The basic idea is to simply create elements with `el` and mount them with `mount`, almost like you would do with plain JavaScript:
```js
import { el, mount } from 'redom';

const hello = el('h1', 'Hello RE:DOM!');

mount(document.body, hello);
```
–>
```html
<body>
  <h1>Hello RE:DOM!</h1>
</body>
```

### Text reference
String and Number arguments (after the query) generate text nodes. You can also use the `text` helper, which will return a reference to the text node:
```js
import { text, mount } from 'redom';

const hello = text('hello');

mount(document.body, hello);

hello.textContent = 'hi!';
```
–>
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
–>
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
–>
```html
<div style="color: red;"></div>
<div style="color: red;"></div>
 ```

### Attributes and properties
Properties and attributes are auto-detected:
```js
el('input', { type="email", autofocus: true, value: 'foo' })
```
–>
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
–>
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
–>
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
–>
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
–>
```html
<a>
  <b></b>
</a>
```

### Alias
You can use `el` or `html`:

```js
import { el, html } from 'redom';

el('div')
html('div')
```
–>
```html
<div></div>
<div></div>
```

### SVG
`el` and `html` only create HTML elements. If you want to create a SVG element, you must use `svg`:
```js
import { svg, mount } from 'redom';

const drawing = svg('svg',
  svg('circle', { r: 50, cx: 25, cy: 25 })
);

mount(document.body, drawing);
```
–>
```html
<body>
  <svg>
    <circle r="50" cx="25" cy="25"></circle>
  </svg>
</body>
```

## Mounting
Please use `mount`/`unmount`/`setChildren` every time you need to mount/unmount elements inside a RE:DOM app. These functions will trigger lifecycle events, add references to components etc.

### Mount
You can mount elements/components with `mount(parent, child, [before])`. If you define the third parameter, it works like `insertBefore` and otherwise it's like `appendChild`.

Mount will trigger the `mount` [lifecycle event](#component-lifecycle) the first time you mount a child. If you mount the same child again to the same parent, `remount` gets called. If you mount it to another place, `onunmount` and `onmount` get called. Read more about lifecycle events [here](#component-lifecycle).

```js
import { el, mount } from 'redom';

const hello = el('h1', 'Hello RE:DOM!');

// append element:
mount(document.body, hello);

// insert before the first element:
mount(document.body, hello, document.body.firstChild);
```

### Unmount
If you need to remove elements/components, use `unmount(parent, child)`. That will trigger the `unmount` [lifecycle event](#component-lifecycle):

```js
unmount(document.body, hello);
```

### Set children
RE:DOM uses `setChildren(parent, children)` under the hood for [lists](#lists). When you call `setChildren`, RE:DOM will add/reorder/remove elements/components automatically by reference:
```js
import { el, setChildren } from 'redom';

const a = el('a');
const b = el('b');
const c = el('c');

setChildren(document.body, [a, b, c]);
setChildren(document.body, [c, b]);
```
–>
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
A helper for updating attributes and properties. It will auto-detect attributes and properties:
```js
import { el, setAttr } from 'redom';

const hello = el('h1', 'Hello RE:DOM!');

setAttr(hello, {
  style: { color: 'red' },
  className: 'hello' // You could also just use 'class'
});
```
### setStyle
There's also a shortcut for updating the `style` attribute:
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
RE:DOM v2.0.0 supports true lifecycle events. Three events are defined: `onmount`, `onremount` and `onunmount`.

* First time you mount the element, `onmount` gets called.
* If you mount the same element again to the same parent, `onremount` gets called.
* If you move an element from a parent to another parent, `onunmount` gets called.

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
–>
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
That's when the `list` helper comes to rescue.

To use `list`, just define a parent node and component:
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

const list = list('ul', Li);

mount(document.body, list);

list.update([1, 2, 3]);
list.update([2, 2, 4]);
```

### List lifecycle

When you call `List.update`, the list will automatically:

- Create new components for new items
- Mount new components in the right place
- Reorder moved items (remount)
- Remove deleted items
- Trigger any [lifecycle](#component-lifecycle) events
- Call `.update` for all components, except removed ones

### Keyed list
Normally `list` will update by index, so it only adds/removes the last item.

If you want to define a key, you can do that by adding a third parameter to the `list`. With key, the list will automatically insert/reorder/remove elements by that key of each object in the list.

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

const list = list('ul', Li, '_id');

mount(document.body, list);

list.update([
  { _id: 1, name: 'Item 1' },
  { _id: 2, name: 'Item 2' },
  { _id: 3, name: 'Item 3' }
]);

setTimeout(() => {
  list.update([
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

const table = el('table');

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
    this.el = list('tr', Tr);
  }
  update (data) {
    this.el.update(data);
  }
}

const table = el('table', Tr);

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
    this.list = list(this.el, Tr);
  }
  update (data) {
    this.list.update(data);
  }
}
const table = el('table', Tr);

mount(document.body, table);
```
or the other way around:
```js
this.list = list('tr', Tr);
this.el = this.list.el;
```

## Router
Router is a component router, which will create/update/remove components based on the current route.

```js
import { router } from 'redom';

import { Home, About, Contact } from './sections/index'

const app = router({
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
- create a `About` component
- update it with `data`
- call all defined [lifecycle events](#component-lifecycle)

## More examples
You can find more examples on [RE:DOM website](https://redom.js.org)!

## Support / feedback
If you have any feedback about RE:DOM, you can join [#redom](https://koodiklinikka.slack.com/messages/redom/) at [koodiklinikka.slack.com](koodiklinikka.slack.com) (get invitation by entering your email at [koodiklinikka.fi](https://koodiklinikka.fi)) or raise an issue on [Github](https://github.com/pakastin/redom).

## Developing
RE:DOM is on [Github](https://github.com/pakastin/redom), source is [here](https://github.com/pakastin/redom/tree/master/src). To start developing:
- Clone repository
- `npm i`
- `npm run dev`

Pull requests are more than welcome!

## License
[MIT](https://github.com/pakastin/redom/blob/master/LICENSE)
