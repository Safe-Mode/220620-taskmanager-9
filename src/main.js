import {Menu} from './components/menu';
import {Search} from './components/search';
import {Filter} from './components/filter';
import {Board} from './components/board';
import {Sorting} from './components/sorting';
import {Task} from './components/task';
import {TaskEdit} from './components/task-edit';
import {MoreBtn} from './components/more-btn';
import {tasks, filters} from './data';
import {render} from './util';

const NUM_SCALE = 10;
const CARDS_PER_PAGE = 8;

const renderTasks = (editFirst) => {
  for (let [index, task] of Object.entries(tasks)) {
    index = parseInt(index, NUM_SCALE);

    if (index === CARDS_PER_PAGE) {
      break;
    }

    if (editFirst && !index) {
      const taskCardEdit = new TaskEdit(task);
      render(boardTasksEl, taskCardEdit.getElement());
    } else {
      const taskCard = new Task(task);
      render(boardTasksEl, taskCard.getElement());
    }

    tasks.shift();
  }

  if (!tasks.length && loadMoreEl) {
    loadMoreEl.remove();
  }
};

const mainEl = document.querySelector(`.main`);
const controlEl = mainEl.querySelector(`.control`);

render(controlEl, new Menu().getElement());
render(mainEl, new Search().getElement());
render(mainEl, new Filter(filters).getElement());
render(mainEl, new Board().getElement());

const boardEl = mainEl.querySelector(`.board`);
const boardTasksEl = boardEl.querySelector(`.board__tasks`);

render(boardEl, new Sorting().getElement(), `begin`);
renderTasks(true);
render(boardEl, new MoreBtn().getElement());

const loadMoreEl = document.querySelector(`.load-more`);

loadMoreEl.addEventListener(`click`, (evt) => {
  evt.preventDefault();
  renderTasks(false);
});
