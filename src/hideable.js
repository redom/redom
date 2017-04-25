import { mount, unmount } from './mount';

export function hideable (view) {
  const el = view.el || view;
  const placeholder = document.createTextNode('');
  const update = view.update;
  let visible = true;

  view.show = () => {
    if (visible) {
      return;
    }
    if (view !== el) {
      view.el = el;
      view.update = update;
    }

    const parent = placeholder.parentNode;

    if (parent) {
      const next = placeholder.nextSibling;

      mount(parent, view, next);
      unmount(parent, placeholder);
    }

    visible = true;

    return view;
  };

  view.hide = () => {
    if (!visible) {
      return;
    }
    const parent = el.parentNode;

    if (parent) {
      const next = el.nextSibling;

      unmount(parent, view);
      mount(parent, placeholder, next);
    }

    if (view !== el) {
      view.el = placeholder;
      view.update = () => {};
    }

    visible = false;

    return view;
  };

  return view;
}

export const hidable = hideable;
