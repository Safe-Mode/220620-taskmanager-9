import flatpickr from 'flatpickr';
import '../../node_modules/flatpickr/dist/flatpickr.css';
import {isEscPressed, render} from '../util';
import {Task} from '../components/task';
import {TaskEdit} from '../components/task-edit';

class TaskController {
  constructor(container, data, onDataChange, onChangeView, position) {
    this._container = container;
    this._data = data;
    this._task = new Task(this._data);
    this._taskEdit = new TaskEdit(this._data);
    this._onDataChange = onDataChange;
    this._onChangeView = onChangeView;
    this._position = position;
  }

  _toggleActiveBtnState(btn) {
    const clsMethod = (btn.classList.contains(`card__btn--disabled`)) ? `remove` : `add`;
    btn.classList[clsMethod](`card__btn--disabled`);
  }

  setDefaultView() {
    if (this._container.contains(this._taskEdit.getElement())) {
      this._container.replaceChild(this._task.getElement(), this._taskEdit.getElement());
    }
  }

  init() {
    const taskEl = this._task.getElement();
    const taskEditEl = this._taskEdit.getElement();
    const taskEditBtnEl = taskEl.querySelector(`.card__btn--edit`);
    const taskEditFormEl = taskEditEl.querySelector(`form`);
    const taskEditTextEl = taskEditFormEl.querySelector(`textarea`);
    const taskArchiveBtnEl = taskEl.querySelector(`.card__btn--archive`);
    const taskFavoritesBtnEl = taskEl.querySelector(`.card__btn--favorites`);
    const editArchiveBtnEl = taskEditEl.querySelector(`.card__btn--archive`);
    const editFavoritesBtnEl = taskEditEl.querySelector(`.card__btn--favorites`);

    const onTaskEditBtnClick = (evt) => {
      evt.preventDefault();

      this._onChangeView();
      this._container.replaceChild(taskEditEl, taskEl);
      document.addEventListener(`keydown`, onEscKeydown);
    };

    const onTaskEditFormSubmit = (evt) => {
      evt.preventDefault();

      const formData = new FormData(evt.target);

      const entry = {
        description: formData.get(`text`),
        dueDate: formData.get(`date`),
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
        isArchive: this._data.isArchive,
        isFavorite: this._data.isFavorite,
      };

      this._onDataChange(entry, this._data);
      document.removeEventListener(`keydown`, onEscKeydown);
    };

    const onEscKeydown = (evt) => {
      if (isEscPressed(evt.key)) {
        this.setDefaultView();
        document.removeEventListener(`keydown`, onEscKeydown);
      }
    };

    const onTaskArchiveBtnClick = (evt) => {
      evt.preventDefault();

      const oldData = this._data;

      this._data.isArchive = !this._data.isArchive;
      this._onDataChange(this._data, oldData);
    };

    const onEditArchiveBtnClick = (evt) => {
      evt.preventDefault();

      this._data.isArchive = !this._data.isArchive;
      this._toggleActiveBtnState(evt.target);
    };

    const onTaskFavoritesBtnClick = (evt) => {
      evt.preventDefault();

      const oldData = this._data;

      this._data.isFavorite = !this._data.isFavorite;
      this._onDataChange(this._data, oldData);
    };

    const onEditFavoritesBtnClick = (evt) => {
      evt.preventDefault();

      this._data.isFavorite = !this._data.isFavorite;
      this._toggleActiveBtnState(evt.target);
    };

    flatpickr(taskEditEl.querySelector(`.card__date`), {
      altInput: true,
      allowInput: true,
      defaultDate: this._data.dueDate,
    });

    taskEditBtnEl.addEventListener(`click`, onTaskEditBtnClick);
    taskEditFormEl.addEventListener(`submit`, onTaskEditFormSubmit);

    taskEditTextEl.addEventListener(`focus`, () => {
      document.removeEventListener(`keydown`, onEscKeydown);
    });

    taskEditTextEl.addEventListener(`blur`, () => {
      document.addEventListener(`keydown`, onEscKeydown);
    });

    taskArchiveBtnEl.addEventListener(`click`, onTaskArchiveBtnClick);
    editArchiveBtnEl.addEventListener(`click`, onEditArchiveBtnClick);
    taskFavoritesBtnEl.addEventListener(`click`, onTaskFavoritesBtnClick);
    editFavoritesBtnEl.addEventListener(`click`, onEditFavoritesBtnClick);

    render(this._container, taskEl, this._position);
  }
}

export {TaskController};
