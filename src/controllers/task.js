import {COLORS} from './../const';
import {isEscPressed, isEnterPressed, render} from '../util';
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
    this._tmpData = null;
  }

  _toggleActiveBtnState(btn) {
    const clsMethod = (btn.classList.contains(`card__btn--disabled`)) ? `remove` : `add`;
    btn.classList[clsMethod](`card__btn--disabled`);
  }

  _initTmpData() {
    this._tmpData = Object.assign({}, this._data);
    this._tmpData.hasDate = Boolean(this._tmpData.dueDate);
    this._tmpData.isRepeating = Object.keys(this._tmpData.repeatingDays).some((day) => this._tmpData.repeatingDays[day]);
  }

  _resetTmpData() {
    this._tmpData = null;
  }

  setDefaultView() {
    if (this._container.contains(this._taskEdit.getElement())) {
      this._container.replaceChild(this._task.getElement(), this._taskEdit.getElement());
      this._taskEdit.removeElement();
      this._resetTmpData();
    }
  }

  init() {
    const taskEl = this._task.getElement();
    const taskEditBtnEl = taskEl.querySelector(`.card__btn--edit`);
    const taskArchiveBtnEl = taskEl.querySelector(`.card__btn--archive`);
    const taskFavoritesBtnEl = taskEl.querySelector(`.card__btn--favorites`);

    const onTaskEditFormSubmit = (evt) => {
      evt.preventDefault();

      const formData = new FormData(evt.target);

      const entry = {
        description: formData.get(`text`),
        dueDate: (formData.get(`date`)) ? new Date(formData.get(`date`) + new Date().getFullYear()).getTime() : null,
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
        isArchive: this._tmpData.isArchive,
        isFavorite: this._tmpData.isFavorite,
      };

      this._onDataChange(entry, this._data);
      document.removeEventListener(`keydown`, onEscKeydown);
    };

    const onDeadlineTogglerClick = (evt) => {
      evt.preventDefault();

      const clsMethod = (this._tmpData.hasDate) ? `add` : `remove`;
      const container = evt.currentTarget.closest(`.card__dates`);

      this._tmpData.hasDate = !this._tmpData.hasDate;
      container.querySelector(`.card__date`).disabled = !this._tmpData.hasDate;
      evt.currentTarget.querySelector(`.card__date-status`).innerText = (this._tmpData.hasDate) ? `yes` : `no`;

      container
        .querySelector(`.card__date-deadline`)
        .classList[clsMethod](`visually-hidden`);
    };

    const onRepeatTogglerClick = (evt) => {
      evt.preventDefault();

      const clsMethod = (this._tmpData.isRepeating) ? `add` : `remove`;
      const container = evt.currentTarget.closest(`.card__dates`);

      this._tmpData.isRepeating = !this._tmpData.isRepeating;

      container.querySelectorAll(`.card__repeat-day-input`).forEach((input) => {
        input.disabled = !this._tmpData.isRepeating;
      });

      evt.currentTarget.querySelector(`.card__repeat-status`).innerText = (this._tmpData.isRepeating) ? `yes` : `no`;

      evt.currentTarget
        .closest(`.card__dates`)
        .querySelector(`.card__repeat-days`)
        .classList[clsMethod](`visually-hidden`);
    };

    const onColorInput = (evt) => {
      const newColor = `card--${evt.target.value}`;

      for (let color of COLORS) {
        const oldColor = `card--${color}`;
        this._taskEdit.getElement().classList.replace(oldColor, newColor);
      }
    };

    const onHashtagEnter = (evt) => {
      if (isEnterPressed(evt.key)) {
        evt.preventDefault();

        if (evt.target.value) {
          this._taskEdit
            .getElement()
            .querySelector(`.card__hashtag-list`)
            .insertAdjacentHTML(`beforeend`, `
              <span class="card__hashtag-inner">
                <input
                  type="hidden"
                  name="hashtag"
                  value="${evt.target.value}"
                  class="card__hashtag-hidden-input"
                />
                <p class="card__hashtag-name">
                  #${evt.target.value}
                </p>
                <button type="button" class="card__hashtag-delete">
                  delete
                </button>
              </span>
            `);

          evt.target.value = ``;
        }
      }
    };

    const onHashtagDeleteClick = (evt) => {
      evt.preventDefault();

      evt.target
        .closest(`.card__hashtag-inner`)
        .remove();
    };

    const onTaskEditTextFocus = () => {
      document.removeEventListener(`keydown`, onEscKeydown);
    };

    const onTaskEditTextBlur = () => {
      document.addEventListener(`keydown`, onEscKeydown);
    };

    const onTaskArchiveBtnClick = (evt) => {
      evt.preventDefault();

      const oldData = this._data;

      this._data.isArchive = !this._data.isArchive;
      this._onDataChange(this._data, oldData);
    };

    const onEditArchiveBtnClick = (evt) => {
      evt.preventDefault();

      this._tmpData.isArchive = !this._tmpData.isArchive;
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

      this._tmpData.isFavorite = !this._tmpData.isFavorite;
      this._toggleActiveBtnState(evt.target);
    };

    const onEscKeydown = (evt) => {
      if (isEscPressed(evt.key)) {
        this.setDefaultView();
        document.removeEventListener(`keydown`, onEscKeydown);
      }
    };

    const onTaskEditBtnClick = (evt) => {
      evt.preventDefault();

      const taskEditEl = this._taskEdit.getElement();
      const taskEditFormEl = taskEditEl.querySelector(`form`);
      const taskEditTextEl = taskEditFormEl.querySelector(`textarea`);

      this._onChangeView();
      this._container.replaceChild(taskEditEl, taskEl);
      this._initTmpData();

      taskEditFormEl.addEventListener(`submit`, onTaskEditFormSubmit);
      taskEditTextEl.addEventListener(`focus`, onTaskEditTextFocus);
      taskEditTextEl.addEventListener(`blur`, onTaskEditTextBlur);
      document.addEventListener(`keydown`, onEscKeydown);

      taskEditEl
        .querySelector(`.card__btn--archive`)
        .addEventListener(`click`, onEditArchiveBtnClick);
      taskEditEl
        .querySelector(`.card__btn--favorites`)
        .addEventListener(`click`, onEditFavoritesBtnClick);
      taskEditEl
        .querySelector(`.card__date-deadline-toggle`)
        .addEventListener(`click`, onDeadlineTogglerClick);
      taskEditEl
        .querySelector(`.card__repeat-toggle`)
        .addEventListener(`click`, onRepeatTogglerClick);
      taskEditEl
        .querySelector(`.card__colors-wrap`)
        .addEventListener(`input`, onColorInput);
      taskEditEl
        .querySelector(`.card__hashtag-input`)
        .addEventListener(`keydown`, onHashtagEnter);
      taskEditEl
        .querySelector(`.card__hashtag-list`)
        .addEventListener(`click`, onHashtagDeleteClick);
    };

    taskEditBtnEl.addEventListener(`click`, onTaskEditBtnClick);
    taskArchiveBtnEl.addEventListener(`click`, onTaskArchiveBtnClick);
    taskFavoritesBtnEl.addEventListener(`click`, onTaskFavoritesBtnClick);

    render(this._container, taskEl, this._position);
  }
}

export {TaskController};
