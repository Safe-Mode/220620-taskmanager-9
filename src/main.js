import {cloneDeep} from 'lodash';
import {render} from './util';
import {Menu} from './components/menu';
import {Search} from './components/search';
import {FilterController} from './controllers/filter';
import {StatController} from './controllers/stat';
import {BoardController} from './controllers/board';
import {SearchController} from './controllers/search';
import {tasks, filters} from './data';

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

const onFilterChange = (evt) => {
  let filtered = [];

  switch (evt.target.id) {
    case `filter__all`:
      filtered = cloneDeep(tasks);
      break;
    case `filter__overdue`:
      filtered = tasks.filter((task) => {
        return task.isOverdue;
      });

      break;
    case `filter__today`:
      filtered = tasks.filter((task) => {
        return new Date(task.dueDate).toDateString() === new Date(Date.now()).toDateString();
      });

      break;
    case `filter__favorites`:
      filtered = tasks.filter((task) => {
        return task.isFavorite;
      });

      break;
    case `filter__repeating`:
      filtered = tasks.filter((task) => {
        return Object.values(task.repeatingDays).some((value) => {
          return value;
        });
      });

      break;
    case `filter__tags`:
      filtered = tasks.filter((task) => {
        return task.tags.length;
      });

      break;
    case `filter__archive`:
      filtered = tasks.filter((task) => {
        return task.isArchive.length;
      });

      break;
  }

  stat.hide();
  searchResult.hide();
  board.show(filtered);
};

const searchResult = new SearchController(mainEl, search, onSearchBackBtnClick);
const filter = new FilterController(mainEl, filters, onFilterChange);

menuEl.addEventListener(`input`, (evt) => {
  switch (evt.target.id) {
    case taskID:
      stat.hide();
      searchResult.hide();
      board.show();
      break;
    case `control__statistic`:
      stat.show(tasks);
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

stat.hide();
render(controlEl, menuEl);
render(mainEl, search.getElement());
filter.init();
stat.init();
board.init();
