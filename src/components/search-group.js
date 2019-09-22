import {AbstractComponent} from './abstract-component';

class SearchGroup extends AbstractComponent {
  getTemplate() {
    return `
      <section class="result__group"></section>
    `;
  }
}

export {SearchGroup};
