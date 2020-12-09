function Checklist(parms) {
    this.id                     = null;
    this.notebook_id            = null;
    this.name                   = null;
    this.content                = null;
    this.hidden                 = null;
    this.date_created           = null;
    this.date_modified          = null;
    this.date_created_display   = null;
    this.date_modified_display  = null;
    this.date_diff_minutes      = null;
    this.date_diff_hours        = null;
    this.date_diff_days         = null;
    this.date_diff_months       = null;
    this.date_diff_years        = null;
    this.page_type              = null;
    this.count_comments         = null;

    // create the keys
    const keys = Object.keys(this);
    for (let count = 0; count < keys.length; count++) {
        const key = keys[count];

        if (parms[key] != undefined) {
            this[key] = parms[key];
        }
    }

  this.items = [];

  const self = this;

}


Checklist.prototype.getHtml = function() {
  let html = '';

  let hidden = '';
  if (this.hidden == 'y') {
    hidden = 'd-none';
  }

  html += `<div class="card card-page card-checklist ${hidden} display-mode-normal" data-page-hidden="${this.hidden}" data-page-id="${this.id}">`;
  html += this.getHtmlHeader();
  html += this.getHtmlBody();
  html += '</div></div>';
  html += '</div>'; // end card

  let utils = new Utilities();
  return html;
}

Checklist.prototype.getHtmlHeader = function() {

  const inputHtml = this.getHtmlItemInput();
  const dateDiffDisplay = this.getDateDiffHtml();

  let html = `
  <div class="card-header">
    <div class="card-header-normal">
      <div class="left">
        <h5 class="card-page-name">${this.name}</h5>
        <small class="card-page-date-created">${dateDiffDisplay}</small>
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
        <input type="text" class="form-control page-edit-name-input" placeholder="Update the name" value="${this.name}">
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


Checklist.prototype.getDateDiffHtml = function() {
    let result = 'just now';

    if (this.date_diff_minutes == null) {
        return result;
    } else if (this.date_diff_hours == null) {
        return result;
    } else if (this.date_diff_days == null) {
        return result;
    } else if (this.date_diff_months == null) {
        return result;
    } else if (this.date_diff_years == null) {
        return result;
    } else {
        result = this.getDateDiffTimeBlock();
        return result;
    }

}

Checklist.prototype.getDateDiffTimeBlock = function() {
    let result = '';

    if (this.date_diff_minutes < 1) {
        result = 'less than a minute ago';
        return result;
    }

    else if (this.date_diff_minutes < 60) {
        const unitDisplay = this.getDateDiffUnitsDisplay(this.date_diff_minutes, 'minute');
        result = `${this.date_diff_minutes} ${unitDisplay} ago`;
        return result;
    } 
    
    else if (this.date_diff_hours < 24) {
        const unitDisplay = this.getDateDiffUnitsDisplay(this.date_diff_hours, 'hour');
        result = `${this.date_diff_hours} ${unitDisplay} ago`;
        return result;
    } 
    
    else if (this.date_diff_days < 31) {
        const unitDisplay = this.getDateDiffUnitsDisplay(this.date_diff_days, 'day');
        result = `${this.date_diff_days} ${unitDisplay} ago`;
        return result;
    } 
    
    else if (this.date_diff_months < 12) {
        const unitDisplay = this.getDateDiffUnitsDisplay(this.date_diff_months, 'month');
        result = `${this.date_diff_months} ${unitDisplay} ago`;
        return result;
    } 
    
    else {
        const unitDisplay = this.getDateDiffUnitsDisplay(this.date_diff_years, 'year');
        result = `${this.date_diff_years} ${unitDisplay} ago`;
        return result;
    } 

}

Checklist.prototype.getDateDiffUnitsDisplay = function(value, label) {
    if (value > 1) {
        return label + 's';
    } else {
        return label;
    }
}