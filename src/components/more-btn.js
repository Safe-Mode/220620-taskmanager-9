import {AbstractComponent} from './abstract-component';

class MoreBtn extends AbstractComponent {
  getTemplate() {
    return `
      <button class="load-more" type="button">load more</button>
    `;
  }
}

export {MoreBtn};
