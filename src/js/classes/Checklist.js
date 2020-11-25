

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
  html += `<div class="card card-page card-checklist" data-page-id="${this.id}">`;
  html += this.getHtmlHeader();
  html += this.getHtmlBody();
  html += '</div>';   // end card

  let utils = new Utilities();
  return html;
}

Checklist.prototype.getHtmlHeader = function() {
  let html = `
  <div class="card-header">
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
          <button class="dropdown-item btn-page-delete" type="button">Delete</button>
        </div>
      </div>
    </div>          
  </div>`;

  return html;
}


Checklist.prototype.getHtmlBody = function() {

  const itemsHtml = this.getHtmlItems();

  let html = `
  <div class="card-body">
    <div class="content display-mode-normal">
      <div class="items">
        ${itemsHtml}
      </div>
    </div>
  </div>`;

  return html;
}


Checklist.prototype.getHtmlItems = function() {

  let html = '';
  for (let count = 0; count < this.items.length; count++)
    html += this.items[count].getHtml();

  return html;

}