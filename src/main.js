import {getMenuTpl} from './components/menu';
import {getSearchTpl} from './components/search';
import {getFilterTpl} from './components/filter';
import {getBoardTpl} from './components/board';
import {getSortTpl} from './components/sorting';
import {getTaskCardTpl} from './components/task-card';
import {getCardFormTpl} from './components/form-card';
import {getMoreBtnTpl} from './components/more-btn';
import {tasks, filters} from './data';

const NUM_SCALE = 10;
const CARDS_PER_PAGE = 8;

const renderElement = (container, tpl, position = `beforeend`) => {
  container.insertAdjacentHTML(position, tpl);
};

const renderTasks = (editFirst) => {
  for (let [index, task] of Object.entries(tasks)) {
    index = parseInt(index, NUM_SCALE);

    if (index === CARDS_PER_PAGE) {
      break;
    }

    if (editFirst && !index) {
      renderElement(boardTasksEl, getCardFormTpl());
    } else {
      renderElement(boardTasksEl, getTaskCardTpl(task));
    }

    tasks.shift();
  }

  if (!tasks.length && loadMoreEl) {
    loadMoreEl.remove();
  }
};

const mainEl = document.querySelector(`.main`);
const controlEl = mainEl.querySelector(`.control`);

renderElement(controlEl, getMenuTpl());
renderElement(mainEl, getSearchTpl());
renderElement(mainEl, getFilterTpl(filters));
renderElement(mainEl, getBoardTpl());

const boardEl = mainEl.querySelector(`.board`);
const boardTasksEl = boardEl.querySelector(`.board__tasks`);

renderElement(boardEl, getSortTpl(), `afterbegin`);
renderTasks(true);
renderElement(boardEl, getMoreBtnTpl());

const loadMoreEl = document.querySelector(`.load-more`);

loadMoreEl.addEventListener(`click`, (evt) => {
  evt.preventDefault();
  renderTasks(false);
});
