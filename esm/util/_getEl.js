const _getEl = (parent) => (parent.nodeType && parent) || (!parent.el && parent) || _getEl(parent.el);
export default _getEl;
