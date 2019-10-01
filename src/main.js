import {render} from './util';
import {Menu} from './components/menu';
import {Search} from './components/search';
import {Filter} from './components/filter';
import {StatController} from './controllers/stat';
import {BoardController} from './controllers/board';
import {SearchController} from './controllers/search';
import {tasks, filters} from './data';
import Chart from 'chart.js';

const mainEl = document.querySelector(`.main`);
const controlEl = mainEl.querySelector(`.control`);
const search = new Search();
const board = new BoardController(mainEl, tasks);
const menu = new Menu();
const menuEl = menu.getElement();
const stat = new StatController(mainEl, tasks);
const taskID = `control__task`;
let hasSearch = false;

const onSearchBackBtnClick = (evt) => {
  evt.preventDefault();

  searchResult.hide();
  stat.hide();
  board.show();
};

const searchResult = new SearchController(mainEl, search, onSearchBackBtnClick);

menuEl.addEventListener(`input`, (evt) => {
  switch (evt.target.id) {
    case taskID:
      stat.hide();
      searchResult.hide();
      board.show();
      break;
    case `control__statistic`:
      stat.show();
      searchResult.hide();
      board.hide();
      break;
    case `control__new-task`:
      stat.hide();
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
  .addEventListener(`focus`, (evt) => {
    if (!evt.target.value) {
      if (!hasSearch) {
        hasSearch = searchResult.init();
      }

      board.hide();
      stat.hide();
      searchResult.show(tasks);
    }
  });

// stat.hide();
render(controlEl, menuEl);
render(mainEl, search.getElement());
render(mainEl, new Filter(filters).getElement());
stat.init();
board.init();
