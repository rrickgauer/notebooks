function Constants() {
  this.API = 'api.notebooks.php';
}


Constants.prototype.API_FUNCTIONS = {
  insertNotebook: 'insert-notebook',
  deleteNotebook: 'delete-notebook',
  getNotebooks: 'get-notebooks',
  insertPage: 'insert-page',
  insertNote: 'insert-note',
  insertChecklist: 'insert-checklist',
  getPages: 'get-pages',
  updateNote: 'update-note',
  updateChecklist: 'update-checklist',
  getChecklistItems: 'get-checklist-items',
  insertChecklistItem: 'insert-checklist-item',
  updateChecklistItemCompleted: 'update-checklist-item-completed',
  updateChecklistItemContent: 'update-checklist-item-content',
  deleteChecklistItem: 'delete-checklist-item',
  updateNotebook: 'update-notebook',
  deleteNote: 'delete-note',
  deleteChecklist: 'delete-checklist',
  insertNotebookLabel: 'insert-notebook-label',
  getNotebookLabels: 'get-notebook-labels',
  getNotebookLabel: 'get-notebook-label',
  getNotebookLabelsAssigned: 'get-notebook-labels-assigned',
  insertNotebookLabelsAssigned: 'insert-notebook-labels-assigned',
  deleteNotebookLabelAssigned: 'delete-notebook-label-assigned',
  updateNotebookLabel: 'update-notebook-label',
  deleteNotebookLabel: 'delete-notebook-label',
  getCommentsNote: 'get-comments-note',
  insertCommentNote: 'insert-comment-note',
  updateCommentNote: 'update-comment-note',
  deleteCommentNote: 'delete-comment-note',
  getNotebookAll: 'get-notebook-all',
  loginAttempt: 'login-attempt',
  updateChecklistItemsAllComplete: 'update-checklist-items-all-complete',
  deleteChecklistItemsComplete: 'delete-checklist-items-complete',
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