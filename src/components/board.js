import {CARDS_PER_PAGE} from '../const';
import {isEscPressed, render} from '../util';
import {AbstractComponent} from './abstract-component';
import {Sort} from './sort';
import {Task} from './task';
import {TaskEdit} from './task-edit';
import {MoreBtn} from './more-btn';

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

class BoardController {
  constructor(container, tasks) {
    this._container = container;
    this._tasks = tasks;
    this._tasksToRender = tasks;
    this._renderedTasks = 0;
    this._sortEl = new Sort().getElement();
    this._boardEl = new Board(this._tasks).getElement();
    this._tasksEl = this._boardEl.querySelector(`.board__tasks`);
    this._loadMoreEl = new MoreBtn().getElement();
  }

  _renderTask(tasksEl, task) {
    const taskCard = new Task(task);
    const taskEditCard = new TaskEdit(task);
    const taskCardEl = taskCard.getElement();
    const taskEditBtnEl = taskCardEl.querySelector(`.card__btn--edit`);
    const taskEditCardEl = taskEditCard.getElement();
    const taskEditFormEl = taskEditCardEl.querySelector(`form`);
    const taskEditTextarea = taskEditFormEl.querySelector(`textarea`);

    const onTaskEditBtnClick = (evt) => {
      evt.preventDefault();

      tasksEl.replaceChild(taskEditCardEl, taskCardEl);
      document.addEventListener(`keydown`, onEscKeydown);
    };

    const onTaskEditFormSubmit = (evt) => {
      evt.preventDefault();

      tasksEl.replaceChild(taskCardEl, taskEditCardEl);
      document.removeEventListener(`keydown`, onEscKeydown);
    };

    const onEscKeydown = (evt) => {
      if (isEscPressed(evt.key)) {
        tasksEl.replaceChild(taskCardEl, taskEditCardEl);
        document.removeEventListener(`keydown`, onEscKeydown);
      }
    };

    taskEditBtnEl.addEventListener(`click`, onTaskEditBtnClick);
    taskEditFormEl.addEventListener(`submit`, onTaskEditFormSubmit);

    taskEditTextarea.addEventListener(`focus`, () => {
      document.removeEventListener(`keydown`, onEscKeydown);
    });

    taskEditTextarea.addEventListener(`blur`, () => {
      document.addEventListener(`keydown`, onEscKeydown);
    });

    render(tasksEl, taskCard.getElement());
  }

  _renderTasks(isContinues = true) {
    const quantity = (isContinues) ? CARDS_PER_PAGE : this._renderedTasks;
    this._renderedTasks = (isContinues) ? this._renderedTasks : 0;
    const endIndex = this._renderedTasks + quantity;

    for (let i = this._renderedTasks; i < endIndex && i < this._tasksToRender.length; i++) {
      this._renderTask(this._tasksEl, this._tasksToRender[i]);
      this._renderedTasks++;
    }

    if (this._renderedTasks >= this._tasksToRender.length && this._loadMoreEl) {
      this._loadMoreEl.remove();
    }
  }

  _onSortLinkClick(evt) {
    evt.preventDefault();

    const sortType = evt.target.dataset.type;

    if (sortType) {
      const tasksCopy = this._tasks.slice();
      this._tasksEl.innerHTML = ``;

      switch (sortType) {
        case `default`:
          this._tasksToRender = this._tasks;
          this._renderTasks(false);
          break;
        case `date-up`:
          const dateUpTasks = tasksCopy.sort((first, second) => first.dueDate - second.dueDate);

          this._tasksToRender = dateUpTasks;
          this._renderTasks(false);
          break;
        case `date-down`:
          const dateDownTasks = tasksCopy.sort((first, second) => second.dueDate - first.dueDate);

          this._tasksToRender = dateDownTasks;
          this._renderTasks(false);
          break;
      }
    }
  }

  init() {
    this._sortEl.addEventListener(`click`, (evt) => this._onSortLinkClick(evt));
    render(this._boardEl, this._sortEl, `begin`);
    this._renderTasks();

    this._loadMoreEl.addEventListener(`click`, (evt) => {
      evt.preventDefault();
      this._renderTasks();
    });

    render(this._boardEl, this._loadMoreEl);
    render(this._container, this._boardEl);
  }
}

export {BoardController};
