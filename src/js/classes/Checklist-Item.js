function ChecklistItem(parms) {
  this.id           = parms.id; 
  this.checklistID  = parms.checklist_id; 
  this.content      = parms.content; 
  this.completed    = parms.completed; 
  this.dateCreated  = parms.date_created; 
  this.dateModified = parms.date_modified;
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