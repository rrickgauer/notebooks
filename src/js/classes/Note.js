function Note(parms) {

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

}


Note.prototype.getHtml = function() {
    let html = '';
    
    let hidden = '';
    if (this.hidden == 'y') {
        hidden = 'd-none';
    }    

    html += `<div class="card card-page card-note display-mode-normal ${hidden}" data-page-id="${this.id}" data-page-hidden="${this.hidden}">`;
    html += this.getHtmlHeader();
    html += this.getHtmlBody();
    
    html += `
    <div class="card-footer d-none">
        <form class="new-comment">
            <div class="form-group">
                <input type="text" class="form-control new-comment-content" placeholder="Write a comment..."> 
                <div class="invalid-feedback">Comments cannot be empty.</div> 
            </div>
                               
        </form>
        <ul class="comment-list list-unstyled"></ul>
    </div>`;
    
    html += '</div>'; // end card
    
    let utils = new Utilities();
    return html;
}

Note.prototype.getHtmlHeader = function() {

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
                        <button class="dropdown-item btn-page-popout" type="button">Pop out</button>
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
            <input type="text" class="form-control page-edit-name-input" placeholder="Update the name" value="${this.name}">
        </div>
    
    </div>`;
    
    return html;
}


Note.prototype.getHtmlBody = function() {
    const dataTarget = `.card-page[data-page-id='${this.id}'] .tab-pane`;
    
    // don't display null
    let contentDisplayTextArea = this.content;
    if (contentDisplayTextArea == null)
    contentDisplayTextArea = '';
    
    let util = new Utilities();
    const contentMarkdown = util.renderMarkdown(contentDisplayTextArea);
    
    
    let html = `
    <div class="card-body">
        <div class="content">
            <div class="rendered github-css">${contentMarkdown}</div>
        
            <div class="edit">
                <div class="tab-pane write show active" role="tabpanel">
                    <textarea class="form-control edit-input textarea-plus" rows="5" placeholder="Add some content...">${contentDisplayTextArea}</textarea>
                </div>
                <div class="page-edit-buttons d-flex justify-content-end mt-3">
                    <button type="button" class="btn btn-sm btn-outline-danger btn-page-update-cancel mr-2">Cancel</button>
                    <button type="button" class="btn btn-sm btn-success btn-page-update-save">Update note</button>
                </div>
            </div>
        </div>
        <div class="comments-toggle-container">
            <button type="button" class="btn btn-light btn-comment-list-toggle"><i class='bx bx-comment-detail'></i></button>
        </div>
    </div>`;
    
    return html;
}


Note.prototype.getDateDiffHtml = function() {
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

Note.prototype.getDateDiffTimeBlock = function() {
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

Note.prototype.getDateDiffUnitsDisplay = function(value, label) {
    if (value > 1) {
        return label + 's';
    } else {
        return label;
    }
}