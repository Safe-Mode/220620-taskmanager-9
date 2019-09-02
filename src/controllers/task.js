import {isEscPressed, render} from '../util';
import {Task} from '../components/task';
import {TaskEdit} from '../components/task-edit';

class TaskController {
  constructor(container, data) {
    this._container = container;
    this._data = data;
    this._task = new Task(data);
    this._taskEdit = new TaskEdit(data);
  }

  _onDataChange() {

  }

  _onChangeView() {

  }

  init() {
    const taskEl = this._task.getElement();
    const taskEditEl = this._taskEdit.getElement();
    const taskEditBtnEl = taskEl.querySelector(`.card__btn--edit`);
    const taskEditFormEl = taskEditEl.querySelector(`form`);
    const taskEditTextarea = taskEditFormEl.querySelector(`textarea`);

    const onTaskEditBtnClick = (evt) => {
      evt.preventDefault();

      this._container.replaceChild(taskEditEl, taskEl);
      document.addEventListener(`keydown`, onEscKeydown);
    };

    const onTaskEditFormSubmit = (evt) => {
      evt.preventDefault();

      this._container.replaceChild(taskEl, taskEditEl);
      document.removeEventListener(`keydown`, onEscKeydown);
    };

    const onEscKeydown = (evt) => {
      if (isEscPressed(evt.key)) {
        this._container.replaceChild(taskEl, taskEditEl);
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

    render(this._container, taskEl);
  }
}

export {TaskController};
