import {AbstractComponent} from './abstract-component';

class Board extends AbstractComponent {
  constructor(tasks) {
    super();
    this._quantity = tasks.length;
  }

  getTemplate() {
    return `<div class="board container"></div>`;
  }
}

export {Board};
