import { createElement } from './create-element'
import { text } from './text'
import { mount } from './mount'

var cache = {}

export function el (query) {
  var element

  if (typeof query === 'string') {
    element = (cache[query] || (cache[query] = createElement(query))).cloneNode(false)
  } else if (query && query.nodeType) {
    element = query.cloneNode(false)
  } else {
    throw new Error('At least one argument required')
  }

  var empty = true

  for (var i = 1; i < arguments.length; i++) {
    var arg = arguments[i]

    if (!arg) {
      continue
    }

    // support middleware
    if (typeof arg === 'function') {
      arg(element)
    } else if (typeof arg === 'string' || typeof arg === 'number') {
      if (empty) {
        empty = false
        element.textContent = arg
      } else {
        element.appendChild(text(arg))
      }
    } else if (arg.nodeType || (arg.el && arg.el.nodeType)) {
      empty = false
      mount(element, arg)
    } else if (arg.length) {
      empty = false
      for (var j = 0; j < arg.length; j++) {
        mount(element, arg[j])
      }
    } else if (typeof arg === 'object') {
      for (var key in arg) {
        var value = arg[key]

        if (key === 'style') {
          if (typeof value === 'string') {
            element.setAttribute(key, value)
          } else {
            for (var cssKey in value) {
              element.style[cssKey] = value[cssKey]
            }
          }
        } else if (key in element || typeof value === 'function') {
          element[key] = value
        } else {
          element.setAttribute(key, value)
        }
      }
    }
  }

  return element
}

el.extend = function (query) {
  var clone = (cache[query] || (cache[query] = createElement(query)))

  return el.bind(this, clone)
}
