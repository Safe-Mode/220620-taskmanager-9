import {createElement} from '../util';

// const getSortTpl = () => {
//   return `
//     <div class="board__filter-list">
//       <a href="#" class="board__filter">SORT BY DEFAULT</a>
//       <a href="#" class="board__filter">SORT BY DATE up</a>
//       <a href="#" class="board__filter">SORT BY DATE down</a>
//     </div>
//   `;
// };

class Sorting {
  constructor() {
    this._element = null;
  }

  getTemplate() {
    return `
      <div class="board__filter-list">
        <a href="#" class="board__filter">SORT BY DEFAULT</a>
        <a href="#" class="board__filter">SORT BY DATE up</a>
        <a href="#" class="board__filter">SORT BY DATE down</a>
      </div>
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

export {Sorting};
