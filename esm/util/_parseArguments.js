import { mount } from '../mount';
import { setAttr } from '../setattr';
import _getEl from './_getEl';
import _isNode from './_isNode';
import { text } from '../text';

const _parseArguments = (element, args) => {
  for (const arg of args) {
    if (arg !== 0 && !arg) {
      continue;
    }

    const type = typeof arg;

    // support middleware
    if (type === 'function') {
      arg(element);
    } else if (type === 'string' || type === 'number') {
      element.appendChild(text(arg));
    } else if (_isNode(_getEl(arg))) {
      mount(element, arg);
    } else if (arg.length) {
      _parseArguments(element, arg);
    } else if (type === 'object') {
      setAttr(element, arg);
    }
  }
};

export default _parseArguments;
