import {AbstractComponent} from './abstract-component';

class TaskList extends AbstractComponent {
  constructor(tasks) {
    super();
    this._quantity = tasks.length;
  }

  getTemplate() {
    return `
      ${(this._quantity) ? `<div class="board__tasks"></div>` : `<p class="board__no-tasks">
        Congratulations, all tasks were completed! To create a new click on
        «add new task» button.
      </p>`}
    `;
  }
}

export {TaskList};
