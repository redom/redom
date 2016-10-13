/* global CustomEvent */
export function Dispatcher () {

}
Dispatcher.prototype.dispatch = function (type, data) {
  dispatch(this.el, type, data)
}
Dispatcher.prototype.dispatchDown = function (type, data) {
  dispatchDown(this.el, type, data)
}
Dispatcher.prototype.listen = function (type, handler) {
  var el = this.el
  var _handler = function (e) {
    if (e.detail && e.detail.type === type) {
      handler(e.detail.data, e)
    } else if (type === '*') {
      handler(e.detail.type, e.detail.data, e)
    }
  }
  el.addEventListener('redom-event', _handler)
  return {
    cancel: function () {
      el.removeEventListener('redom-event', _handler)
    }
  }
}

function dispatch (el, type, data) {
  var event = new CustomEvent('redom-event', {
    bubbles: true,
    detail: {
      type: type,
      data: data
    }
  })
  el.dispatchEvent(event)
}

function dispatchDown (el, type, data) {
  if (el.__redom_view) {
    var event = new CustomEvent('redom-event', {
      bubbles: false,
      detail: {
        type: type,
        data: data
      }
    })
    el.dispatchEvent(event)
  }
  var traverse = el.firstChild

  while (traverse) {
    dispatchDown(traverse, type, data)
    traverse = traverse.nextSibling
  }
}
