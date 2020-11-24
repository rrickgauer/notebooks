

function Page(parms) {
  this.id                  = parms.id;
  this.notebookID          = parms.notebook_id;
  this.name                = parms.name;
  this.content             = parms.content;
  this.hidden              = parms.hidden;
  this.dateCreated         = parms.date_created;
  this.dateModified        = parms.date_modified;
  this.dateCreatedDisplay  = parms.date_created_display;
  this.dateModifiedDisplay = parms.date_modified_display;

  const self = this;

  $('.btn-page-edit').on('click', function(e) {
    alert('edit');
  });

}


Page.prototype.getHtml = function() {
  let html = '';
  html += `<div class="card card-page" data-page-id="${this.id}">`;
  html += this.getHtmlHeader();
  html += this.getHtmlBody();
  html += '</div>';   // end card
  return html;
}

Page.prototype.getHtmlHeader = function() {
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


Page.prototype.getHtmlBody = function() {
  const dataTarget = `.card-page[data-page-id='${this.id}'] .tab-pane`;

  let html = `
  <div class="card-body">
    <div class="content display-mode-normal">

      <div class="rendered">
        ${this.content}
      </div>

      <div class="edit">
        <nav>
          <div class="nav nav-tabs" role="tablist">
            <button class="nav-link active" data-toggle="tab" data-target="${dataTarget}.write">Write</button>
            <button class="nav-link" data-toggle="tab" data-target="${dataTarget}.preview">Preview</button>
          </div>
        </nav>
        <div class="tab-content">
          <div class="tab-pane write show active" role="tabpanel">
            write
          </div>
          <div class="tab-pane preview" role="tabpanel">preview</div>
        </div>
      </div>

    </div>
  </div>`;

  return html;
}