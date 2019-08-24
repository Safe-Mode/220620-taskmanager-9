const createElement = (template) => {
  const element = document.createElement(`div`);
  element.innerHTML = template;
  return element.firstElementChild;
};

const render = (container, element, position = `end`) => {
  switch (position) {
    case `end`:
      container.append(element);
      break;
    case `begin`:
      container.prepend(element);
      break;
    default:
      throw new Error(`<begin> or <end> positions are valid`);
  }
};

const unrender = (element, cb) => {
  if (element) {
    element.remove();
    cb();
  }
};

export {createElement, render, unrender};
