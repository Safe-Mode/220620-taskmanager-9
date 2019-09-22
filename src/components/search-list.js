import {AbstractComponent} from "./abstract-component";

class SearchList extends AbstractComponent {
  getTemplate() {
    return `<div class="result__cards"></div>`;
  }
}

export {SearchList};
