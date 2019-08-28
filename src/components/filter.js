import {AbstractComponent} from './abstract-component';

class Filter extends AbstractComponent {
  constructor(features) {
    super();
    this._features = features;
  }

  getTemplate() {
    return `
      <section class="main__filter filter container">
        ${this._features.map(({title, count}, index) => `
          <input
            type="radio"
            id="filter__${title.toLowerCase()}"
            class="filter__input visually-hidden"
            name="filter"
            ${(!count) ? `disabled` : ``}
            ${(!index) ? `checked` : ``}
          />
          <label for="filter__${title.toLowerCase()}" class="filter__label">
            ${title} <span class="filter__${title.toLowerCase()}-count">${count}</span>
          </label>
        `).join(``)}
      </section>
    `;
  }
}

export {Filter};
