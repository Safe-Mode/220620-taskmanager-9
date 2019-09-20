import {render} from '../util';
import {SearchResult} from '../components/search-result';

class SearchController {
  constructor(container, search, onSearchBackBtnClick) {
    this._container = container;
    this._search = search;
    this._searchResult = new SearchResult();
    this._onSearchBackBtnClick = onSearchBackBtnClick;
  }

  show() {
    this._searchResult
      .getElement()
      .classList.remove(`visually-hidden`);
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

    render(this._container, this._searchResult.getElement());
    return true;
  }
}

export {SearchController};
