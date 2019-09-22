import {AbstractComponent} from "./abstract-component";

class SearchInfo extends AbstractComponent {
  constructor(title, tasks) {
    super();
    this._title = title;
    this._count = tasks.length;
  }

  getTemplate() {
    return `
      <h2 class="result__title">
        ${this._title}<span class="result__count">${this._count}</span>
      </h2>
    `;
  }
}

export {SearchInfo};
