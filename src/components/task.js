import moment from 'moment';
import {AbstractComponent} from './abstract-component';

class Task extends AbstractComponent {
  constructor({color, repeatingDays, description, dueDate, tags, isArchive, isFavorite}) {
    super();
    this._color = color;
    this._repeatingDays = repeatingDays;
    this._description = description;
    this._dueDate = (dueDate) ? new Date(dueDate) : null;
    this._isOverdue = (this._dueDate) ? Date.now() > dueDate : false;
    this._tags = [...tags];
    this._isArchive = isArchive;
    this._isFavorite = isFavorite;
  }

  getTemplate() {
    return `
      <article class="card card--${this._color} ${Object.keys(this._repeatingDays).some((day) => this._repeatingDays[day]) ? `card--repeat` : ``} ${(this._isOverdue) ? `card--deadline` : ``}">
        <div class="card__form">
          <div class="card__inner">
            <div class="card__control">
              <button type="button" class="card__btn card__btn--edit">
                edit
              </button>
              <button type="button" class="card__btn card__btn--archive ${(this._isArchive) ? `` : `card__btn--disabled`}">
                archive
              </button>
              <button
                type="button"
                class="card__btn card__btn--favorites ${(this._isFavorite) ? `` : `card__btn--disabled`}"
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
              <p class="card__text">${this._description}</p>
            </div>

            <div class="card__settings">
              <div class="card__details">
              ${(this._dueDate) ? `
                <div class="card__dates">
                  <div class="card__date-deadline">
                    <p class="card__input-deadline-wrap">
                      <span class="card__date">${moment(this._dueDate).format(`LL`).toUpperCase()}</span>
                      <span class="card__time">${moment(this._dueDate).format(`h:mm a`).toUpperCase()}</span>
                    </p>
                  </div>
                </div>
              ` : ``}

                <div class="card__hashtag">
                  <div class="card__hashtag-list">
                    ${this._tags.map((tag) => `
                      <span class="card__hashtag-inner">
                        <span class="card__hashtag-name">
                          #${tag}
                        </span>
                      </span>
                    `).join(` `)}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </article>
    `;
  }
}

export {Task};
