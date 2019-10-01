import {CARDS_PER_PAGE} from '../const';
import {render} from '../util';
import {Board} from '../components/board';
import {Sort} from '../components/sort';
import {MoreBtn} from '../components/more-btn';
import {TaskList} from '../components/task-list';
import {TaskListController} from './task-list';


class BoardController {
  constructor(container, tasks) {
    this._container = container;
    this._tasks = tasks;
    this._tasksToRender = tasks;
    this._renderedTasks = 0;
    this._sortEl = new Sort().getElement();
    this._board = new Board(this._tasks);
    this._taskList = new TaskList(this._tasks);
    this._loadMoreEl = new MoreBtn().getElement();
    this._onDataChange = this._onDataChange.bind(this);
    this._taskListController = new TaskListController(this._tasks, this._taskList, this._onDataChange);
  }

  _renderTasks(isContinues = true) {
    const quantity = (isContinues) ? CARDS_PER_PAGE : this._renderedTasks;
    this._renderedTasks = (isContinues) ? this._renderedTasks : 0;
    const endIndex = this._renderedTasks + quantity;

    for (let i = this._renderedTasks; i < endIndex && i < this._tasksToRender.length; i++) {
      this._taskListController.renderTask(this._tasksToRender[i]);
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
      this._taskList.getElement().innerHTML = ``;

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

  _onDataChange(operator, tasks) {
    this._tasksToRender = tasks;
    this._tasks = tasks;

    switch (operator) {
      case `add`:
        this._renderedTasks++;
        break;
      case `sub`:
        this._renderedTasks--;
        break;
    }
  }

  createTask() {
    this._taskListController.createTask();
  }

  show() {
    this._board
      .getElement()
      .classList.remove(`visually-hidden`);
  }

  hide() {
    this._board
      .getElement()
      .classList.add(`visually-hidden`);
  }

  init() {
    const boardEl = this._board.getElement();

    this._sortEl.addEventListener(`click`, (evt) => this._onSortLinkClick(evt));
    this._loadMoreEl.addEventListener(`click`, (evt) => {
      evt.preventDefault();
      this._renderTasks();
    });

    this._renderTasks();
    render(boardEl, this._sortEl, `begin`);
    render(boardEl, this._taskList.getElement());
    render(boardEl, this._loadMoreEl);
    render(this._container, boardEl);
  }
}

export {BoardController};
