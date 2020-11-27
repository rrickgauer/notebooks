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
  updateChecklistItemContent: 'update-checklist-item-content',
  deleteChecklistItem: 'delete-checklist-item',
  updateNotebook: 'update-notebook',
  deleteNote: 'delete-note',
  deleteChecklist: 'delete-checklist',
}

Constants.prototype.PAGES = {
  notebook: 'notebook.php',
  home: 'home.php',
}


Constants.prototype.PAGE_SORTING = {
  oldest: 'oldest',
  newest: 'newest',
  name: 'name',
}


