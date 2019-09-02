import {render} from './util';
import {Menu} from './components/menu';
import {Search} from './components/search';
import {Filter} from './components/filter';
import {BoardController} from './controllers/board';
import {tasks, filters} from './data';

const mainEl = document.querySelector(`.main`);
const controlEl = mainEl.querySelector(`.control`);
const board = new BoardController(mainEl, tasks);

render(controlEl, new Menu().getElement());
render(mainEl, new Search().getElement());
render(mainEl, new Filter(filters).getElement());
board.init();
