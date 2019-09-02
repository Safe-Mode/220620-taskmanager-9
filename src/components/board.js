import {AbstractComponent} from './abstract-component';

class Board extends AbstractComponent {
  constructor(tasks) {
    super();
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
}

export {Board};
