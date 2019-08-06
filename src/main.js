const getMenuTpl = () => {
  return `
    <section class="control__btn-wrap">
      <input
        type="radio"
        name="control"
        id="control__new-task"
        class="control__input visually-hidden"
      />
      <label for="control__new-task" class="control__label control__label--new-task">+ ADD NEW TASK</label>
      <input
        type="radio"
        name="control"
        id="control__task"
        class="control__input visually-hidden"
        checked
      />
      <label for="control__task" class="control__label">TASKS</label>
      <input
        type="radio"
        name="control"
        id="control__statistic"
        class="control__input visually-hidden"
      />
      <label for="control__statistic" class="control__label">STATISTICS</label>
    </section>
  `;
};

const getSearchTpl = () => {
  return `
    <section class="main__search search container">
      <input
        type="text"
        id="search__input"
        class="search__input"
        placeholder="START TYPING — SEARCH BY WORD, #HASHTAG OR DATE"
      />
      <label class="visually-hidden" for="search__input">Search</label>
    </section>
  `;
};

const getFilterTpl = () => {
  return `
    <section class="main__filter filter container">
      <input
        type="radio"
        id="filter__all"
        class="filter__input visually-hidden"
        name="filter"
        checked
      />
      <label for="filter__all" class="filter__label">
        All <span class="filter__all-count">13</span>
      </label>
      <input
        type="radio"
        id="filter__overdue"
        class="filter__input visually-hidden"
        name="filter"
        disabled
      />
      <label for="filter__overdue" class="filter__label">
        Overdue <span class="filter__overdue-count">0</span>
      </label>
      <input
        type="radio"
        id="filter__today"
        class="filter__input visually-hidden"
        name="filter"
        disabled
      />
      <label for="filter__today" class="filter__label">
        Today <span class="filter__today-count">0</span>
      </label>
      <input
        type="radio"
        id="filter__favorites"
        class="filter__input visually-hidden"
        name="filter"
      />
      <label for="filter__favorites" class="filter__label">
        Favorites <span class="filter__favorites-count">1</span>
      </label>
      <input
        type="radio"
        id="filter__repeating"
        class="filter__input visually-hidden"
        name="filter"
      />
      <label for="filter__repeating" class="filter__label">
        Repeating <span class="filter__repeating-count">1</span>
      </label>
      <input
        type="radio"
        id="filter__tags"
        class="filter__input visually-hidden"
        name="filter"
      />
      <label for="filter__tags" class="filter__label">
        Tags <span class="filter__tags-count">1</span>
      </label>
      <input
        type="radio"
        id="filter__archive"
        class="filter__input visually-hidden"
        name="filter"
      />
      <label for="filter__archive" class="filter__label">
        Archive <span class="filter__archive-count">115</span>
      </label>
    </section>
  `;
};

const getTaskCardTpl = (color = 'black', date, time, hashtags, isRepeating, isMissing) => {
  const getHashtagsMarkup = () => {
    return hashtags.reduce((markup, hashtag) => {
      return `
        ${markup}
        <span class="card__hashtag-inner">
          <span class="card__hashtag-name">
            #${hashtag}
          </span>
        </span>
      `;
    });
  };

  return `
    <article class="card card--${color} ${(isRepeating) ? 'card--repeat' : ''} ${(isMissing) ? 'card--deadline' : ''}">
      <div class="card__form">
        <div class="card__inner">
          <div class="card__control">
            <button type="button" class="card__btn card__btn--edit">
              edit
            </button>
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
            <p class="card__text">Example default task with default color.</p>
          </div>

          <div class="card__settings">
            <div class="card__details">
              <div class="card__dates">
                <div class="card__date-deadline">
                  <p class="card__input-deadline-wrap">
                    <span class="card__date">${date}</span>
                    <span class="card__time">${time}</span>
                  </p>
                </div>
              </div>

              <div class="card__hashtag">
                <div class="card__hashtag-list">
                  ${getHashtagsMarkup()}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </article>
  `;
};

const loadMoreBtnTpl = () => {
  return `
    <button class="load-more" type="button">load more</button>
  `;
};
