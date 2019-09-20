import {render} from './util';
import {Menu} from './components/menu';
import {Search} from './components/search';
import {Filter} from './components/filter';
import {Stat} from './components/stat';
import {BoardController} from './controllers/board';
import {SearchController} from './controllers/search';
import {tasks, filters} from './data';

const mainEl = document.querySelector(`.main`);
const controlEl = mainEl.querySelector(`.control`);
const search = new Search();
const board = new BoardController(mainEl, tasks);
const menu = new Menu();
const menuEl = menu.getElement();
const statEl = new Stat().getElement();
const taskID = `control__task`;
let hasSearch = false;

const onSearchBackBtnClick = (evt) => {
  evt.preventDefault();

  searchResult.hide();
  statEl.classList.add(`visually-hidden`);
  board.show();
};

const searchResult = new SearchController(mainEl, search, onSearchBackBtnClick);

menuEl.addEventListener(`input`, (evt) => {
  switch (evt.target.id) {
    case taskID:
      statEl.classList.add(`visually-hidden`);
      searchResult.hide();
      board.show();
      break;
    case `control__statistic`:
      statEl.classList.remove(`visually-hidden`);
      searchResult.hide();
      board.hide();
      break;
    case `control__new-task`:
      statEl.classList.add(`visually-hidden`);
      searchResult.hide();
      board.show();
      board.createTask();
      menuEl.querySelector(`#${taskID}`).checked = true;
      break;
  }
});

search
  .getElement()
  .querySelector(`.search__input`)
  .addEventListener(`focus`, () => {
    if (!hasSearch) {
      hasSearch = searchResult.init();
    }

    board.hide();
    statEl.classList.add(`visually-hidden`);
    searchResult.show();
  });

statEl.classList.add(`visually-hidden`);
render(controlEl, menuEl);
render(mainEl, search.getElement());
render(mainEl, new Filter(filters).getElement());
render(mainEl, statEl);
board.init();
