class SearchView {
  #parenrEl = document.querySelector('.search');

  getQuery() {
    const query = this.#parenrEl.querySelector('.search__field').value;
    this.#clearInput();
    return query;
  }

  #clearInput() {
    this.#parenrEl.querySelector('.search__field').value = '';
  }
  addHandlerSearch(handler) {
    this.#parenrEl.addEventListener('submit', function (e) {
      e.preventDefault();
      handler();
    });
  }
}

export default new SearchView();
