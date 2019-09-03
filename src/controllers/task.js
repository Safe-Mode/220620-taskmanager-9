import {isEscPressed, render} from '../util';
import {Task} from '../components/task';
import {TaskEdit} from '../components/task-edit';

class TaskController {
  constructor(container, data, onDataChange, position) {
    this._container = container;
    this._data = data;
    this._task = new Task(data);
    this._taskEdit = new TaskEdit(data);
    this._onDataChange = onDataChange;
    this._position = position;
  }

  _onChangeView() {

  }

  init() {
    const taskEl = this._task.getElement();
    const taskEditEl = this._taskEdit.getElement();
    const taskEditBtnEl = taskEl.querySelector(`.card__btn--edit`);
    const taskEditFormEl = taskEditEl.querySelector(`form`);
    const taskEditTextEl = taskEditFormEl.querySelector(`textarea`);

    const onTaskEditBtnClick = (evt) => {
      evt.preventDefault();

      this._container.replaceChild(taskEditEl, taskEl);
      document.addEventListener(`keydown`, onEscKeydown);
    };

    const onTaskEditFormSubmit = (evt) => {
      evt.preventDefault();

      const formData = new FormData(evt.target);

      const entry = {
        description: formData.get(`text`),
        dueDate: new Date(formData.get(`date`) + new Date().getFullYear()).getTime(),
        repeatingDays: formData
          .getAll(`repeat`)
          .reduce((days, day) => {
            days[day] = true;
            return days;
          }, {
            mo: false,
            tu: false,
            we: false,
            th: false,
            fr: false,
            sa: false,
            su: false,
          }),
        tags: formData.getAll(`hashtag`),
        color: formData.get(`color`),
      };

      this._onDataChange(entry, this._data);
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

    taskEditTextEl.addEventListener(`focus`, () => {
      document.removeEventListener(`keydown`, onEscKeydown);
    });

    taskEditTextEl.addEventListener(`blur`, () => {
      document.addEventListener(`keydown`, onEscKeydown);
    });

    render(this._container, taskEl, this._position);
  }
}

export {TaskController};
