import {CARDS_PER_PAGE} from '../const';
import {render} from '../util';
import {Board} from '../components/board';
import {Sort} from '../components/sort';
import {MoreBtn} from '../components/more-btn';
import {TaskList} from '../components/task-list';
import {TaskListController} from './task-list';

class BoardController {
  constructor(container, tasks, api) {
    this._container = container;
    this._tasks = tasks;
    this._api = api;
    this._tasksToRender = tasks;
    this._renderedTasks = 0;
    this._sortEl = new Sort().getElement();
    this._board = new Board(this._tasks);
    this._taskList = new TaskList(this._tasks);
    this._loadMoreEl = new MoreBtn().getElement();
    this._onDataChange = this._onDataChange.bind(this);
    this._taskListController = new TaskListController(this._tasks, this._taskList, this._onDataChange);
  }

  _renderTasks(isContinues = true, isEmpty = false) {
    const quantity = (isContinues) ? CARDS_PER_PAGE : this._renderedTasks;
    this._renderedTasks = (isContinues) ? this._renderedTasks : 0;
    const endIndex = (isEmpty) ? this._renderedTasks + CARDS_PER_PAGE : this._renderedTasks + quantity;

    for (let i = this._renderedTasks; i < endIndex && i < this._tasksToRender.length; i++) {
      this._taskListController.renderTask(this._tasksToRender[i]);
      this._renderedTasks++;
    }

    if (this._renderedTasks >= this._tasksToRender.length && this._loadMoreEl) {
      this._loadMoreEl.remove();
    } else if (this._renderedTasks < this._tasksToRender.length && !this._board.getElement().contains(this._loadMoreEl)) {
      render(this._board.getElement(), this._loadMoreEl);
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

  _onDataChange(operator, task, renderFn, unrenderFn) {
    switch (operator) {
      case `add`:
        this._api.createTask(task.toRAW())
          .then(() => this._api.getTasks())
          .then((tasks) => {
            renderFn();
            this._taskListController.setTasks(tasks);
            this._tasksToRender = tasks;
            this._tasks = tasks;
            this._renderedTasks++;
          });
        break;
      case `update`:
        this._api.updateTask({
          id: task.id,
          data: task.toRAW(),
        }).then(renderFn);
        break;
      case `delete`:
        this._api.deleteTask(task)
          .then(() => this._api.getTasks())
          .then((tasks) => {
            unrenderFn();
            this._tasksToRender = tasks;
            this._tasks = tasks;
            this._renderedTasks--;
            this._taskListController.setTasks(tasks);
          });
        break;
    }
  }

  createTask() {
    this._taskListController.createTask();
  }

  show(tasks) {
    this._tasksToRender = tasks;
    // this._tasks = tasks;
    this._taskList.getElement().innerHTML = ``;

    this._renderTasks(false, true);
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

    if (this._tasks.length > 8) {
      render(boardEl, this._loadMoreEl);
    }

    render(this._container, boardEl);
  }
}

export {BoardController};
