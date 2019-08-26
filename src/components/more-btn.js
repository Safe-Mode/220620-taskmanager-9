import {createElement} from '../util';

class MoreBtn {
  constructor() {
    this._element = null;
  }

  getTemplate() {
    return `
      <button class="load-more" type="button">load more</button>
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

export {MoreBtn};
