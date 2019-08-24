import {createElement} from '../util';

// const getBoardTpl = () => {
//   return `
//     <div class="board container">
//       <div class="board__tasks"></div>
//     </div>
//   `;
// };

class Board {
  constructor() {
    this._element = null;
  }

  getTemplate() {
    return `
      <div class="board container">
        <div class="board__tasks"></div>
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

export {Board};
