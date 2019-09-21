import {render, unrender} from '../util';
import {SearchList} from '../components/search-list';
import {SearchGroup} from '../components/search-group';
import {SearchResult} from '../components/search-result';
import {TaskListController} from './task-list';
import {SearchInfo} from '../components/search-info';

class SearchController {
  constructor(container, search, onSearchBackBtnClick) {
    this._container = container;
    this._search = search;
    this._tasks = [];
    this._searchInfo = new SearchInfo(``, this._tasks);
    this._searchList = new SearchList();
    this._searchGroup = new SearchGroup();
    this._searchResult = new SearchResult();
    this._onSearchBackBtnClick = onSearchBackBtnClick;
    this._onDataChange = this._onDataChange.bind(this);
    this._taskListController = new TaskListController(this._tasks, this._searchList, this._onDataChange);
  }

  _onDataChange(tasks) {
    this._tasks = tasks;
  }

  _showSearchResult(text, tasks) {
    if (this._searchInfo) {
      unrender(this._searchInfo.getElement());
      this._searchInfo.removeElement();
    }

    this._searchInfo = new SearchInfo(text, tasks);
    render(this._searchGroup.getElement(), this._searchInfo.getElement(), `begin`);
    this._taskListController.setTasks(tasks);
    this._searchList
      .getElement()
      .innerHTML = ``;

    this._tasks.forEach((task) => {
      this._taskListController.renderTask(task);
    });
  }

  show(tasks) {
    this._tasks = tasks;

    if (this._searchResult.getElement().classList.contains(`visually-hidden`) || this._container.contains(this._searchResult.getElement())) {
      this._showSearchResult(``, this._tasks);
      this._searchResult
        .getElement()
        .classList.remove(`visually-hidden`);
    }
  }

  hide() {
    this._searchResult
      .getElement()
      .classList.add(`visually-hidden`);
  }

  init() {
    this._searchResult
      .getElement()
      .querySelector(`.result__back`)
      .addEventListener(`click`, this._onSearchBackBtnClick);

    render(this._searchGroup.getElement(), this._searchInfo.getElement());
    render(this._searchGroup.getElement(), this._searchList.getElement());
    render(this._searchResult.getElement(), this._searchGroup.getElement());
    render(this._container, this._searchResult.getElement());
    return true;
  }
}

export {SearchController};
