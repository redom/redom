# RE:DOM documentation

## Creating elements

`el` ([alias](#alias): `html`) is a helper for `document.createElement` with couple of differences:

### ID and class names

You can use `#` and `.` as shortcuts for defining id and class names. `div` is the default tag name:
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
You can define styles with string or object:
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
Array of children also works:

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

### Component support
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
`el` and `html` only creates HTML elements. If you want to create an SVG element, you must use `svg`:
```js
import { svg } from 'redom';

svg('svg',
  svg('circle', { r: 50, cx: 25, cy: 25 })
);
```
–>
```html
<svg>
  <circle r="50" cx="25" cy="25"></circle>
</svg>
```
