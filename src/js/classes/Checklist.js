

function Checklist(parms) {
  this.id                  = parms.id;
  this.notebookID          = parms.notebook_id;
  this.name                = parms.name;
  this.hidden              = parms.hidden;
  this.dateCreated         = parms.date_created;
  this.dateModified        = parms.date_modified;
  this.dateCreatedDisplay  = parms.date_created_display;
  this.dateModifiedDisplay = parms.date_modified_display;

  this.items = [];

  const self = this;

}


Checklist.prototype.getHtml = function() {
  let html = '';
  html += `<div class="card card-page card-checklist display-mode-normal" data-page-id="${this.id}">`;
  html += this.getHtmlHeader();
  html += this.getHtmlBody();
  html += '</div></div>';
  html += '</div>';   // end card

  let utils = new Utilities();
  return html;
}

Checklist.prototype.getHtmlHeader = function() {

  const inputHtml = this.getHtmlItemInput();

  let html = `
  <div class="card-header">
    <div class="card-header-normal">
      <div class="left">
        <h5 class="card-page-name">${this.name}</h5>
        <p>&nbsp;&bull;&nbsp;<span class="card-page-date-created">${this.dateCreatedDisplay}</span></p>
      </div>

      <div class="right">
        <div class="dropdown">
          <button class="btn btn-sm" type="button" data-toggle="dropdown">
            <i class='bx bx-dots-horizontal'></i>
          </button>
          <div class="dropdown-menu dropdown-menu-right">
            <button class="dropdown-item btn-page-edit" type="button">Edit</button>
            <button class="dropdown-item btn-page-hide" type="button">Hide</button>
            <div class="dropdown-divider"></div>
            <button class="dropdown-item btn-page-collapse" type="button">Collapse</button>
            <button class="dropdown-item btn-page-expand" type="button">Expand</button>
            <div class="dropdown-divider"></div>
            <button class="dropdown-item btn-page-delete" type="button">Delete</button>
          </div>
        </div>
      </div> 
    </div>
        
    <div class="card-header-edit">
      <div class="page-edit-name-container">
        <input type="text" class="form-control" placeholder="Update the name" value="${this.name}">
      </div>
      <div class="buttons">
        <button type="button" class="btn btn-sm btn-success btn-page-update-save">Save</button>
        <button type="button" class="btn btn-sm btn-light btn-page-update-cancel">Cancel</button>
      </div>
      

    </div>

  </div>
  <div class="card-body">
    <div class="content">${inputHtml}`;

  return html;
}


Checklist.prototype.getHtmlBody = function() {

  const itemsHtml = this.getHtmlItems();
  

  let html = `
  <div class="items">
    ${itemsHtml}
  </div>`;

  return html;
}


Checklist.prototype.getHtmlItems = function() {
  let html = '';
  for (let count = 0; count < this.items.length; count++)
    html += this.items[count].getHtml();

  return html;
}


Checklist.prototype.getHtmlItemInput = function() {
  let html = `
  <div class="input-group mb-3">
    <div class="input-group-prepend">
      <button class="btn btn-outline-secondary btn-checklist-item-add" type="button">+</button>
    </div>
    <input type="text" class="form-control checklist-item-input">
  </div>`;

  return html;

}