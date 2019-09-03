import {CARDS_PER_PAGE} from '../const';
import {render} from '../util';
import {Board} from '../components/board';
import {Sort} from '../components/sort';
import {MoreBtn} from '../components/more-btn';
import {TaskController} from './task';

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
    this._onDataChange = this._onDataChange.bind(this);
    this._onChangeView = this._onChangeView.bind(this);
    this._subscriptions = [];
  }

  _renderTask(task, index) {
    const taskController = new TaskController(this._tasksEl, task, this._onDataChange, this._onChangeView, index);

    taskController.init();
    this._subscriptions.push(taskController.setDefaultView.bind(taskController));
  }

  _renderTasks(isContinues = true) {
    const quantity = (isContinues) ? CARDS_PER_PAGE : this._renderedTasks;
    this._renderedTasks = (isContinues) ? this._renderedTasks : 0;
    const endIndex = this._renderedTasks + quantity;

    for (let i = this._renderedTasks; i < endIndex && i < this._tasksToRender.length; i++) {
      this._renderTask(this._tasksToRender[i]);
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

  _onDataChange(newData, oldData) {
    const taskIndex = this._tasks.findIndex((task) => task === oldData);
    this._tasks[taskIndex] = newData;
    this._renderTask(this._tasks[taskIndex], taskIndex);
  }

  _onChangeView() {
    this._subscriptions.forEach((subscription) => subscription());
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
