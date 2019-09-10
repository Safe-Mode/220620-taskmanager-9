import {render} from './util';
import {Menu} from './components/menu';
import {Search} from './components/search';
import {Filter} from './components/filter';
import {Stat} from './components/stat';
import {BoardController} from './controllers/board';
import {tasks, filters} from './data';

const mainEl = document.querySelector(`.main`);
const controlEl = mainEl.querySelector(`.control`);
const board = new BoardController(mainEl, tasks);
const menuEl = new Menu().getElement();
const statEl = new Stat().getElement();

menuEl.addEventListener(`input`, (evt) => {
  switch (evt.target.id) {
    case `control__task`:
      statEl.classList.add(`visually-hidden`);
      board.show();
      break;
    case `control__statistic`:
      statEl.classList.remove(`visually-hidden`);
      board.hide();
      break;
  }
});

statEl.classList.add(`visually-hidden`);
render(controlEl, menuEl);
render(mainEl, new Search().getElement());
render(mainEl, new Filter(filters).getElement());
render(mainEl, statEl);
board.init();
