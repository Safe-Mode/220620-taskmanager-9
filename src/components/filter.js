import {createElement} from '../util';

// const getFilterTpl = (data) => {
//   return `
//     <section class="main__filter filter container">
//       ${data.map(({title, count}, index) => `
//         <input
//           type="radio"
//           id="filter__${title.toLowerCase()}"
//           class="filter__input visually-hidden"
//           name="filter"
//           ${(!count) ? `disabled` : ``}
//           ${(!index) ? `checked` : ``}
//         />
//         <label for="filter__${title.toLowerCase()}" class="filter__label">
//           ${title} <span class="filter__${title.toLowerCase()}-count">${count}</span>
//         </label>
//       `).join(``)}
//     </section>
//   `;
// };

class Filter {
  constructor(features) {
    this._element = null;
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

  getElement() {
    this._element = (!this._element) ? createElement(this.getTemplate()) : this._element;
    return this._element;
  }

  removeElement() {
    this._element = null;
  }
}

export {Filter};
