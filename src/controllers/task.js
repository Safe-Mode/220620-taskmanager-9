import flatpickr from 'flatpickr';
import '../../node_modules/flatpickr/dist/flatpickr.css';
import {cloneDeep} from 'lodash';
import {isEscPressed, render, unrender} from '../util';
import {Task} from '../components/task';
import {TaskEdit} from '../components/task-edit';

class TaskController {
  constructor(container, data, mode, onDataChange, onChangeView, position) {
    this._container = container;
    this._data = data;
    this._task = new Task(this._data);
    this._taskEdit = new TaskEdit(this._data);
    this._currentView = (mode === `add`) ? this._taskEdit : this._task;
    this._onDataChange = onDataChange;
    this._onChangeView = onChangeView;
    this._position = (mode === `add`) ? `begin` : position;
    this._mode = mode;
  }

  _toggleActiveBtnState(btn) {
    const clsMethod = (btn.classList.contains(`card__btn--disabled`)) ? `remove` : `add`;
    btn.classList[clsMethod](`card__btn--disabled`);
  }

  _closeAddCard() {
    unrender(this._taskEdit.getElement());
    this._taskEdit.removeElement();
    this._onDataChange(null, null);
  }

  _onEscKeydown(evt) {
    if (isEscPressed(evt.key)) {
      switch (this._mode) {
        case `add`:
          this._closeAddCard();
          break;
        default:
          this.setDefaultView();
      }

      document.removeEventListener(`keydown`, this._onEscKeydown);
    }
  }

  _setListeners() {
    const taskEditEl = this._taskEdit.getElement();
    const taskEditFormEl = taskEditEl.querySelector(`form`);
    const taskEditTextEl = taskEditFormEl.querySelector(`textarea`);
    const editArchiveBtnEl = taskEditEl.querySelector(`.card__btn--archive`);
    const editFavoritesBtnEl = taskEditEl.querySelector(`.card__btn--favorites`);
    const taskDeleteBtnEl = taskEditEl.querySelector(`.card__delete`);
    const taskEditDateEl = taskEditEl.querySelector(`.card__date`);

    const onTaskEditFormSubmit = (evt) => {
      evt.preventDefault();

      const formData = new FormData(evt.target);

      const entry = {
        description: formData.get(`text`),
        dueDate: new Date(formData.get(`date`)).getTime(),
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

      this._onDataChange(entry, (this._mode === `add`) ? null : this._data);
      document.removeEventListener(`keydown`, this._onEscKeydown);
    };

    const onEditArchiveBtnClick = (archiveEvt) => {
      archiveEvt.preventDefault();

      this._data.isArchive = !this._data.isArchive;
      this._toggleActiveBtnState(archiveEvt.target);
    };

    const onEditFavoritesBtnClick = (favoriteEvt) => {
      favoriteEvt.preventDefault();

      this._data.isFavorite = !this._data.isFavorite;
      this._toggleActiveBtnState(favoriteEvt.target);
    };

    const onCardDeleteBtnClick = (deleteEvt) => {
      deleteEvt.preventDefault();

      switch (this._mode) {
        case `add`:
          this._closeAddCard();
          break;
        default:
          this._onDataChange(null, this._data);
      }
    };

    if (taskEditDateEl) {
      flatpickr(taskEditDateEl, {
        altInput: true,
        allowInput: true,
        defaultDate: this._data.dueDate
      });
    }

    if (this._mode === `add`) {
      document.addEventListener(`keydown`, (evt) => this._onEscKeydown(evt));
    }

    taskEditFormEl.addEventListener(`submit`, onTaskEditFormSubmit);
    editArchiveBtnEl.addEventListener(`click`, onEditArchiveBtnClick);
    editFavoritesBtnEl.addEventListener(`click`, onEditFavoritesBtnClick);
    taskDeleteBtnEl.addEventListener(`click`, onCardDeleteBtnClick);

    taskEditTextEl.addEventListener(`focus`, () => {
      document.removeEventListener(`keydown`, (evt) => this._onEscKeydown(evt));
    });

    taskEditTextEl.addEventListener(`blur`, () => {
      document.addEventListener(`keydown`, (evt) => this._onEscKeydown(evt));
    });
  }

  setDefaultView() {
    if (this._container.contains(this._taskEdit.getElement())) {
      this._container.replaceChild(this._task.getElement(), this._taskEdit.getElement());
    }
  }

  init() {
    const taskEl = this._task.getElement();
    const taskEditBtnEl = taskEl.querySelector(`.card__btn--edit`);
    const taskArchiveBtnEl = taskEl.querySelector(`.card__btn--archive`);
    const taskFavoritesBtnEl = taskEl.querySelector(`.card__btn--favorites`);

    const onTaskEditBtnClick = (evt) => {
      evt.preventDefault();

      this._onChangeView();
      this._taskEdit = new TaskEdit(this._data);
      this._setListeners();
      this._container.replaceChild(this._taskEdit.getElement(), taskEl);
      document.addEventListener(`keydown`, (escEvt) => this._onEscKeydown(escEvt));
    };

    const onTaskArchiveBtnClick = (evt) => {
      evt.preventDefault();

      const oldData = this._data;

      this._data = cloneDeep(this._data);
      this._data.isArchive = !this._data.isArchive;
      this._onDataChange(this._data, oldData);
    };

    const onTaskFavoritesBtnClick = (evt) => {
      evt.preventDefault();

      const oldData = this._data;

      this._data = cloneDeep(this._data);
      this._data.isFavorite = !this._data.isFavorite;
      this._onDataChange(this._data, oldData);
    };

    this._setListeners();

    taskEditBtnEl.addEventListener(`click`, onTaskEditBtnClick);
    taskArchiveBtnEl.addEventListener(`click`, onTaskArchiveBtnClick);
    taskFavoritesBtnEl.addEventListener(`click`, onTaskFavoritesBtnClick);

    render(this._container, this._currentView.getElement(), this._position);
  }
}

export {TaskController};
