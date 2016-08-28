export function mount (parent, child, before) {
  if (before) {
    parent.insertBefore(child, before);
  } else {
    parent.appendChild(child);
  }
}
