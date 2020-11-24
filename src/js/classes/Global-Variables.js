function GlobalVariables() {
  const queryString = window.location.search;
  const urlParams   = new URLSearchParams(window.location.search);
  this.notebookID = urlParams.get('notebookID');
}

