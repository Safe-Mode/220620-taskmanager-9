const createElement = (template) => {
  const element = document.createElement(`div`);
  element.innerHTML = template;
  return element.firstElementChild;
};

const render = (container, element, position = `end`) => {
  if (typeof position === `number`) {
    console.log(position);

    container.replaceChild(element, container.children[position]);
    return;
  }

  switch (position) {
    case `end`:
      container.append(element);
      break;
    case `begin`:
      container.prepend(element);
      break;
    default:
      throw new Error(`"begin", "end" or <index> positions are valid`);
  }
};

const unrender = (element, cb) => {
  if (element) {
    element.remove();
    cb();
  }
};

const isEscPressed = (key) => {
  return key === `Escape` || key === `Esc`;
};

export {createElement, render, unrender, isEscPressed};
