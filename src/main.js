import {getMenuTpl} from './components/menu';
import {getSearchTpl} from './components/search';
import {getFilterTpl} from './components/filter';
import {getBoardTpl} from './components/board';
import {getSortTpl} from './components/sorting';
import {getTaskCardTpl} from './components/task-card';
import {getCardFormTpl} from './components/form-card';
import {getMoreBtnTpl} from './components/more-btn';
import {tasks, filters} from './data';

const renderElement = (container, tpl, position = `beforeend`) => {
  container.insertAdjacentHTML(position, tpl);
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

tasks.forEach((task, index) => {
  if (!index) {
    renderElement(boardTasksEl, getCardFormTpl());
  } else {
    renderElement(boardTasksEl, getTaskCardTpl(task));
  }
});

renderElement(boardEl, getMoreBtnTpl());
