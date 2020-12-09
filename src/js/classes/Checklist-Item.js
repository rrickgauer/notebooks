function ChecklistItem(parms) {
  this.id             = null;
  this.checklistID    = null;
  this.content        = null;
  this.completed      = null;
  this.dateCreated    = null;
  this.dateModified   = null;


  const thisKeys = Object.keys(this);
  for (let count = 0; count < thisKeys.length; count++) {
      const key = thisKeys[count];

      if (parms[key] != undefined) {
          this[key] = parms[key];
      }
  }


}


ChecklistItem.prototype.getHtml = function() {
  // determine whether or not to check the checkbox
  let completedDisplay = '';
  if (this.completed == 'y')
    completedDisplay = 'checked';

  let completedClass = '';
  if (this.completed == 'y')
    completedClass = 'completed';

  let html = `
  <div class="checklist-item ${completedClass}" data-checklist-item-id="${this.id}">
    <div class="left">
      <div class="form-check">
        <label class="form-check-label">
          <input class="form-check-input" type="checkbox" ${completedDisplay}>
          <span class="content">${this.content}</span>
        </label>
      </div>
    </div>

    <div class="right">
      <div class="dropdown">
        <button class="btn btn-sm" type="button" data-toggle="dropdown">
          <i class='bx bx-dots-horizontal'></i>
        </button>
        <div class="dropdown-menu dropdown-menu-right">
          <button class="dropdown-item btn-checklist-item-edit" type="button">Edit</button>
          <button class="dropdown-item btn-checklist-item-delete" type="button">Delete</button>
        </div>
      </div>
    </div>
  </div>`;

  return html;
};



ChecklistItem.prototype.getEditContentHtml = function() {
  let html = `
  <div class="checklist-item" data-checklist-item-id="${this.id}">
    <div class="checklist-item-editor">
      <div class="input">
        <input type="text" class="form-control checklist-item-editor-input" value="${this.content}" placeholder="Enter text...">
      </div>
      
      <div class="buttons">
        <button type="button" class="btn btn-sm btn-success btn-checklist-item-edit save">Save</button>
        <button type="button" class="btn btn-sm btn-danger btn-checklist-item-edit cancel">Cancel</button>
      </div>
    </div>
  </div>`;

  return html;
}