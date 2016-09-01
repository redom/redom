import { doc } from './globals';

export function text (content) {
  return doc.createTextNode(content);
}
