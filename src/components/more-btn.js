import {AbstractComponent} from './abstract-component';

class MoreBtn extends AbstractComponent {
  constructor() {
    super();
  }

  getTemplate() {
    return `
      <button class="load-more" type="button">load more</button>
    `;
  }
}

export {MoreBtn};
