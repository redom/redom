export function ref(ctx, key, value) {
  ctx[key] = value;
  return value;
}
