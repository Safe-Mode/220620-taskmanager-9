import {CARDS_PER_PAGE} from './const';
import {isEscPressed, render} from './util';
import {Menu} from './components/menu';
import {Search} from './components/search';
import {Filter} from './components/filter';
import {Board} from './components/board';
import {Sorting} from './components/sorting';
import {Task} from './components/task';
import {TaskEdit} from './components/task-edit';
import {MoreBtn} from './components/more-btn';
import {tasks, filters} from './data';

const mainEl = document.querySelector(`.main`);
const controlEl = mainEl.querySelector(`.control`);
const boardEl = new Board(tasks).getElement();
const boardTasksEl = boardEl.querySelector(`.board__tasks`);
const loadMoreEl = new MoreBtn().getElement();

const renderTasks = (row = 1) => {
  const beginIndex = (row - 1) * CARDS_PER_PAGE;
  const renderedTasksCount = CARDS_PER_PAGE * row;
  const endIndex = renderedTasksCount - 1;

  for (let i = beginIndex; i <= endIndex && i < tasks.length; i++) {
    const taskCard = new Task(tasks[i]);
    const taskEditCard = new TaskEdit(tasks[i]);
    const taskCardEl = taskCard.getElement();
    const taskEditBtnEl = taskCardEl.querySelector(`.card__btn--edit`);
    const taskEditCardEl = taskEditCard.getElement();
    const taskEditFormEl = taskEditCardEl.querySelector(`form`);
    const taskEditTextarea = taskEditFormEl.querySelector(`textarea`);

    const onTaskEditBtnClick = (evt) => {
      evt.preventDefault();

      boardTasksEl.replaceChild(taskEditCardEl, taskCardEl);
      document.addEventListener(`keydown`, onEscKeydown);
    };

    const onTaskEditFormSubmit = (evt) => {
      evt.preventDefault();

      boardTasksEl.replaceChild(taskCardEl, taskEditCardEl);
      document.removeEventListener(`keydown`, onEscKeydown);
    };

    const onEscKeydown = (evt) => {
      if (isEscPressed(evt.key)) {
        boardTasksEl.replaceChild(taskCardEl, taskEditCardEl);
        document.removeEventListener(`keydown`, onEscKeydown);
      }
    };

    taskEditBtnEl.addEventListener(`click`, onTaskEditBtnClick);
    taskEditFormEl.addEventListener(`submit`, onTaskEditFormSubmit);

    taskEditTextarea.addEventListener(`focus`, () => {
      document.removeEventListener(`keydown`, onEscKeydown);
    });

    taskEditTextarea.addEventListener(`blur`, () => {
      document.addEventListener(`keydown`, onEscKeydown);
    });

    render(boardTasksEl, taskCard.getElement());
  }

  if (renderedTasksCount >= tasks.length && loadMoreEl) {
    loadMoreEl.remove();
  }

  return ++row;
};

render(controlEl, new Menu().getElement());
render(mainEl, new Search().getElement());
render(mainEl, new Filter(filters).getElement());
render(mainEl, boardEl);
render(boardEl, new Sorting().getElement(), `begin`);
render(boardEl, loadMoreEl);

let cardsRow = renderTasks();

loadMoreEl.addEventListener(`click`, (evt) => {
  evt.preventDefault();
  cardsRow = renderTasks(cardsRow);
});
