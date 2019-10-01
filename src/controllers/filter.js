import {render} from '../util';
import {Filter} from '../components/filter';

class FilterController {
  constructor(container, filters, onFilterChange) {
    this._container = container;
    this._filters = filters;
    this._filter = new Filter(this._filters);
    this._onFilterChange = onFilterChange;
  }

  init() {
    const filterEl = this._filter.getElement();
    filterEl.addEventListener(`change`, this._onFilterChange);
    render(this._container, filterEl);
  }
}

export {FilterController};
