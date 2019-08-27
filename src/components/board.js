import {createElement} from '../util';

class Board {
  constructor(tasks) {
    this._element = null;
    this._quantity = tasks.length;
  }

  getTemplate() {
    return `
      <div class="board container">
        ${(this._quantity) ? `<div class="board__tasks"></div>` : `<p class="board__no-tasks">
          Congratulations, all tasks were completed! To create a new click on
          «add new task» button.
        </p>`}
      </div>
    `;
  }

  getElement() {
    this._element = (!this._element) ? createElement(this.getTemplate()) : this._element;
    return this._element;
  }

  removeElement() {
    this._element = null;
  }
}

export {Board};
