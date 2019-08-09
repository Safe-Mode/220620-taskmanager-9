import { getMenuTpl } from './components/menu';
import { getSearchTpl } from './components/search';
import { getFilterTpl } from './components/filter';
import { getBoardTpl } from './components/board';
import { getSortTpl } from './components/sorting';
import { getTaskCardTpl } from './components/task-card';
import { getCardFormTpl } from './components/form-card';
import { getMoreBtnTpl } from './components/more-btn';

const renderElement = (container, tpl, position = `beforeend`) => {
  container.insertAdjacentHTML(position, tpl);
};

const mainEl = document.querySelector(`.main`);
const controlEl = mainEl.querySelector(`.control`);

renderElement(controlEl, getMenuTpl());
renderElement(mainEl, getSearchTpl());
renderElement(mainEl, getFilterTpl());
renderElement(mainEl, getBoardTpl());

const boardEl = mainEl.querySelector(`.board`);
const boardTasksEl = boardEl.querySelector(`.board__tasks`);

renderElement(boardEl, getSortTpl(), `afterbegin`);
renderElement(boardTasksEl, getCardFormTpl());

for (let i = 0; i < 3; i++) {
  renderElement(boardTasksEl, getTaskCardTpl());
}

renderElement(boardEl, getMoreBtnTpl());
