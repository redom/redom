export const text = str => {
  return document.createTextNode((str != null) ? str : '');
};
