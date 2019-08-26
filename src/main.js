import {CARDS_PER_PAGE} from './const';
import {Menu} from './components/menu';
import {Search} from './components/search';
import {Filter} from './components/filter';
import {Board} from './components/board';
import {Sorting} from './components/sorting';
import {Task} from './components/task';
import {TaskEdit} from './components/task-edit';
import {MoreBtn} from './components/more-btn';
import {tasks, filters} from './data';
import {isEscPressed, render} from './util';

const renderTasks = () => {
  for (let i = 0; i < tasks.length; i++) {
    if (i === CARDS_PER_PAGE) {
      break;
    }

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

    const taskCard = new Task(tasks[i]);
    const taskEditCard = new TaskEdit(tasks[i]);
    const taskCardEl = taskCard.getElement();
    const taskEditBtnEl = taskCardEl.querySelector(`.card__btn--edit`);
    const taskEditCardEl = taskEditCard.getElement();
    const taskEditFormEl = taskEditCardEl.querySelector(`form`);
    const taskEditTextarea = taskEditFormEl.querySelector(`textarea`);

    taskEditBtnEl.addEventListener(`click`, onTaskEditBtnClick);
    taskEditFormEl.addEventListener(`submit`, onTaskEditFormSubmit);

    taskEditTextarea.addEventListener(`focus`, () => {
      document.removeEventListener(`keydown`, onEscKeydown);
    });

    taskEditTextarea.addEventListener(`blur`, () => {
      document.addEventListener(`keydown`, onEscKeydown);
    });

    render(boardTasksEl, taskCard.getElement());
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
renderTasks();
render(boardEl, new MoreBtn().getElement());

const loadMoreEl = document.querySelector(`.load-more`);

loadMoreEl.addEventListener(`click`, (evt) => {
  evt.preventDefault();
  renderTasks();
});
