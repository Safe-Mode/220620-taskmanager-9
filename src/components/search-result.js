import {AbstractComponent} from "./abstract-component";

class SearchResult extends AbstractComponent {
  getTemplate() {
    return `
      <section class="result container">
        <button class="result__back">back</button>

        <section class="result__group">
          <h2 class="result__title">
            #work<span class="result__count">17</span>
          </h2>
          <div class="result__cards">
            <article class="card card--black">
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
                            <span class="card__date">23 September</span>
                            <span class="card__time">11:15 PM</span>
                          </p>
                        </div>
                      </div>

                      <div class="card__hashtag">
                        <div class="card__hashtag-list">
                          <span class="card__hashtag-inner">
                            <span class="card__hashtag-name">
                              #todo
                            </span>
                          </span>

                          <span class="card__hashtag-inner">
                            <span class="card__hashtag-name">
                              #personal
                            </span>
                          </span>

                          <span class="card__hashtag-inner">
                            <span class="card__hashtag-name">
                              #important
                            </span>
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </article>
          </div>
        </section>
      </section>
    `;
  }
}

export {SearchResult};
