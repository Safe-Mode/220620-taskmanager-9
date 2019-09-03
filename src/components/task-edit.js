import {COLORS, DAYS} from './../const';
import {isEnterPressed} from './../util';
import {AbstractComponent} from './abstract-component';

class TaskEdit extends AbstractComponent {
  constructor({color, repeatingDays, description, dueDate, tags}) {
    super();
    this._color = color;
    this._repeatingDays = repeatingDays;
    this._isRepeating = Object.keys(this._repeatingDays).some((day) => this._repeatingDays[day]);
    this._description = description;
    this._isOverdue = Date.now() > dueDate;
    this._dueDate = new Date(dueDate);
    this._hasDate = Boolean(this._dueDate);
    this._tags = tags;
    this._element = this.getElement();
    this._colors = [...this._element.querySelectorAll(`.card__color-input`)].map((input) => input.value);

    this._addHashtag();
    this._removeHashtag();
    this._switchDateFlag();
    this._switchRepeatFlag();
    this._colorize();
  }

  getTemplate() {
    return `
      <article class="card card--edit card--${this._color} ${(this._isRepeating) ? `card--repeat` : ``} ${(this._isOverdue) ? `card--deadline` : ``}">
        <form class="card__form" method="get">
          <div class="card__inner">
            <div class="card__control">
              <button type="button" class="card__btn card__btn--archive">
                archive
              </button>
              <button
                type="button"
                class="card__btn card__btn--favorites card__btn--disabled"
              >
                favorites
              </button>
            </div>

            <div class="card__color-bar">
              <svg class="card__color-bar-wave" width="100%" height="10">
                <use xlink:href="#wave"></use>
              </svg>
            </div>

            <div class="card__textarea-wrap">
              <label>
                <textarea
                  class="card__text"
                  placeholder="Start typing your text here..."
                  name="text"
                >${this._description}</textarea>
              </label>
            </div>

            <div class="card__settings">
              <div class="card__details">
                <div class="card__dates">
                  <button class="card__date-deadline-toggle" type="button">
                    date: <span class="card__date-status">${(this._dueDate) ? `yes` : `no`}</span>
                  </button>

                  <fieldset class="card__date-deadline ${(this._dueDate) ? `` : `visually-hidden`}">
                    <label class="card__input-deadline-wrap">
                      <input
                        class="card__date"
                        type="text"
                        placeholder=""
                        name="date"
                        value="${new Intl.DateTimeFormat(`en-GB`, {month: `long`, day: `numeric`}).format(this._dueDate).toUpperCase()} ${new Intl.DateTimeFormat(`en-GB`, {hour: `2-digit`, minute: `2-digit`, hour12: true}).format(this._dueDate).toUpperCase()}"
                      />
                    </label>
                  </fieldset>

                  <button class="card__repeat-toggle" type="button">
                    repeat:<span class="card__repeat-status">${(this._isRepeating) ? `yes` : `no`}</span>
                  </button>

                  <fieldset class="card__repeat-days ${(this._isRepeating) ? `` : `visually-hidden`}">
                    <div class="card__repeat-days-inner">
                      ${DAYS.map((day) => `
                        <input
                          class="visually-hidden card__repeat-day-input"
                          type="checkbox"
                          id="repeat-${day}-4"
                          name="repeat"
                          value="${day}"
                          ${(this._repeatingDays[day]) ? `checked` : ``}
                        />
                        <label class="card__repeat-day" for="repeat-${day}-4"
                          >${day}</label
                        >
                      `).join(``)}
                    </div>
                  </fieldset>
                </div>

                <div class="card__hashtag">
                  <div class="card__hashtag-list">
                    ${this._tags.map((tag) => `
                      <span class="card__hashtag-inner">
                        <input
                          type="hidden"
                          name="hashtag"
                          value="${tag}"
                          class="card__hashtag-hidden-input"
                        />
                        <p class="card__hashtag-name">
                          #${tag}
                        </p>
                        <button type="button" class="card__hashtag-delete">
                          delete
                        </button>
                      </span>
                    `).join(``)}
                  </div>

                  <label>
                    <input
                      type="text"
                      class="card__hashtag-input"
                      name="hashtag-input"
                      placeholder="Type new hashtag here"
                    />
                  </label>
                </div>
              </div>

              <div class="card__colors-inner">
                <h3 class="card__colors-title">Color</h3>
                <div class="card__colors-wrap">
                  ${COLORS.map((color) => `
                    <input
                      type="radio"
                      id="color-${color}-4"
                      class="card__color-input card__color-input--${color} visually-hidden"
                      name="color"
                      value="${color}"
                      ${(this._color === color) ? `checked` : ``}
                    />
                    <label
                      for="color-${color}-4"
                      class="card__color card__color--${color}"
                      >${color}</label
                    >
                  `).join(``)}
                </div>
              </div>
            </div>

            <div class="card__status-btns">
              <button class="card__save" type="submit">save</button>
              <button class="card__delete" type="button">delete</button>
            </div>
          </div>
        </form>
      </article>
    `;
  }

  _removeHashtag() {
    this._element
      .querySelector(`.card__hashtag-list`)
      .addEventListener(`click`, (evt) => {
        evt.preventDefault();

        evt.target
          .closest(`.card__hashtag-inner`)
          .remove();
      });
  }

  _addHashtag() {
    this._element
      .querySelector(`.card__hashtag-input`)
      .addEventListener(`keydown`, (evt) => {
        if (isEnterPressed(evt.key)) {
          evt.preventDefault();

          if (evt.target.value) {
            this._element
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
      });
  }

  _switchDateFlag() {
    this._element
      .querySelector(`.card__date-deadline-toggle`)
      .addEventListener(`click`, (evt) => {
        evt.preventDefault();

        const clsMethod = (this._hasDate) ? `add` : `remove`;
        const container = evt.currentTarget.closest(`.card__dates`);

        this._hasDate = !this._hasDate;
        container.querySelector(`.card__date`).disabled = !this._hasDate;
        evt.currentTarget.querySelector(`.card__date-status`).innerText = (this._hasDate) ? `yes` : `no`;

        container
          .querySelector(`.card__date-deadline`)
          .classList[clsMethod](`visually-hidden`);
      });
  }

  _switchRepeatFlag() {
    this._element
      .querySelector(`.card__repeat-toggle`)
      .addEventListener(`click`, (evt) => {
        evt.preventDefault();

        const clsMethod = (this._isRepeating) ? `add` : `remove`;
        const container = evt.currentTarget.closest(`.card__dates`);

        this._isRepeating = !this._isRepeating;

        container.querySelectorAll(`.card__repeat-day-input`).forEach((input) => {
          input.disabled = !this._isRepeating;
        });

        evt.currentTarget.querySelector(`.card__repeat-status`).innerText = (this._isRepeating) ? `yes` : `no`;

        evt.currentTarget
          .closest(`.card__dates`)
          .querySelector(`.card__repeat-days`)
          .classList[clsMethod](`visually-hidden`);
      });
  }

  _colorize() {
    this._element
      .querySelector(`.card__colors-wrap`)
      .addEventListener(`input`, (evt) => {
        const newColor = `card--${evt.target.value}`;

        for (let color of this._colors) {
          const oldColor = `card--${color}`;
          this._element.classList.replace(oldColor, newColor);
        }
      });
  }
}

export {TaskEdit};
