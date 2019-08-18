const getFilterTpl = (data) => {
  return `
    <section class="main__filter filter container">
      ${data.map(({title, count}, index) => `
        <input
          type="radio"
          id="filter__${title.toLowerCase()}"
          class="filter__input visually-hidden"
          name="filter"
          ${(!count) ? `disabled` : ``}
          ${(!index) ? `checked` : ``}
        />
        <label for="filter__${title.toLowerCase()}" class="filter__label">
          ${title} <span class="filter__${title.toLowerCase()}-count">${count}</span>
        </label>
      `).join(``)}
    </section>
  `;
};

export {getFilterTpl};
