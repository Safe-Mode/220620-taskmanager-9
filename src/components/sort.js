import {AbstractComponent} from './abstract-component';

class Sort extends AbstractComponent {
  getTemplate() {
    return `
      <div class="board__filter-list">
        <a href="#" class="board__filter" data-type="default">SORT BY DEFAULT</a>
        <a href="#" class="board__filter" data-type="date-up">SORT BY DATE up</a>
        <a href="#" class="board__filter" data-type="date-down">SORT BY DATE down</a>
      </div>
    `;
  }
}

export {Sort};
