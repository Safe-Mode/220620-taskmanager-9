import {CARDS_PER_PAGE} from '../const';
import {isEscPressed, render} from '../util';
import {AbstractComponent} from './abstract-component';
import {Sorting} from './sorting';
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

  init() {
    const boardEl = new Board(this._tasks).getElement();
    const tasksEl = boardEl.querySelector(`.board__tasks`);
    const loadMoreEl = new MoreBtn().getElement();

    const renderTasks = (row = 1) => {
      const beginIndex = (row - 1) * CARDS_PER_PAGE;
      const renderedTasksCount = CARDS_PER_PAGE * row;
      const endIndex = renderedTasksCount - 1;

      for (let i = beginIndex; i <= endIndex && i < this._tasks.length; i++) {
        this._renderTask(tasksEl, this._tasks[i]);
      }

      if (renderedTasksCount >= this._tasks.length && loadMoreEl) {
        loadMoreEl.remove();
      }

      return ++row;
    };

    render(boardEl, new Sorting().getElement(), `begin`);

    let cardsRow = renderTasks();

    loadMoreEl.addEventListener(`click`, (evt) => {
      evt.preventDefault();
      cardsRow = renderTasks(cardsRow);
    });

    render(this._container, boardEl);
  }
}

export {BoardController};
