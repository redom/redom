export function createElement(query, ns) {
  const { tag, id, className } = parse(query);
  const element = ns
    ? document.createElementNS(ns, tag)
    : document.createElement(tag);

  if (id) {
    element.id = id;
  }

  if (className) {
    if (ns) {
      element.setAttribute("class", className);
    } else {
      element.className = className;
    }
  }

  return element;
}

function parse(query) {
  const chunks = query.split(/([.#])/);
  let className = "";
  let id = "";

  for (let i = 1; i < chunks.length; i += 2) {
    switch (chunks[i]) {
      case ".":
        className += ` ${chunks[i + 1]}`;
        break;

      case "#":
        id = chunks[i + 1];
    }
  }

  return {
    className: className.trim(),
    tag: chunks[0] || "div",
    id,
  };
}
