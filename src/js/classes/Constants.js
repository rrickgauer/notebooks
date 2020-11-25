function Constants() {
  this.API = 'api.notebooks.php';
}


Constants.prototype.API_FUNCTIONS = {
  insertNotebook: 'insert-notebook',
  getNotebooks: 'get-notebooks',
  insertPage: 'insert-page',
  insertNote: 'insert-note',
  insertChecklist: 'insert-checklist',
  getPages: 'get-pages',
  updateNote: 'update-note',
  getChecklistItems: 'get-checklist-items',
  insertChecklistItem: 'insert-checklist-item',
  updateChecklistItemCompleted: 'update-checklist-item-completed',
}

Constants.prototype.PAGES = {
  notebook: 'notebook.php',
}



