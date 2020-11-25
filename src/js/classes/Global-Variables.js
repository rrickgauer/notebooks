function GlobalVariables() {
  const queryString = window.location.search;
  const urlParams   = new URLSearchParams(window.location.search);
  this.notebookID = urlParams.get('notebookID');

  consts = new Constants();


  this.sort=urlParams.get('sort');
  if (this.sort == null)
    this.sort = consts.PAGE_SORTING.oldest;
}

