

function PageComment(inputParm) {
    this.id = null;
    this.note_id = null;
    this.content = null;
    this.date_created = null;
    this.type = null;
    this.date_diff_minutes = null;
    this.date_diff_hours = null;
    this.date_diff_days = null;
    this.date_diff_months = null;
    this.date_diff_years = null;

    const keys = Object.keys(this);

    if (inputParm == null || inputParm == undefined) {
        return;
    }

    // assign every key to each other if they are defined
    for (let count = 0; count < keys.length; count++) {
        const key = keys[count];
        if (inputParm[key] == undefined) {
            this[key] = null;
        } else {
            this[key] = inputParm[key];
        }
    }
}


PageComment.prototype.getHtml = function() {

    const dateDiff = this.getDateDiffHtml();

    let html = `
    <li class="comment-list-item" data-comment-id="${this.id}">
        <div class="section-view">
            <div class="icon">
                <i class='bx bx-comment'></i>
            </div>
            <div class="body">
                <div class="content">${this.content}</div>
                <div class="footer">
                    <small class="footer-date">${dateDiff}</small>
                    <div class="footer-buttons">
                        <button class="btn-link btn-comment-list-item-view-edit">Edit</button>
                        <button class="btn-link btn-comment-list-item-view-delete">Delete</button>
                    </div>
                </div>
            </div>
        </div>

        <div class="section-edit d-none">
            <form class="edit-comment">
                <div class="form-group">
                    <input type="text" class="form-control form-control-sm edit-comment-input" value="${this.content}">
                    <div class="invalid-feedback">Comments cannot be empty.</div>
                </div>
                <div class="action-buttons">
                    <button type="button" class="btn btn-sm btn-success edit-comment-btn-save">Save</button>
                    <button type="button" class="btn btn-sm btn-light edit-comment-btn-cancel">Cancel</button> 
                </div>
            </form>
        </div>

    </li>`;

    return html;
}


PageComment.prototype.getHtmlSkeleton = function() {
    const skeletonPrefix = '<div class="skeleton-text skeleton-effect-wave">';
    const skeleton1 = 'it just means that the element will flow into the page as it normally would';
    const skeleton2 = 'This is the default for every single page element.';
    const skeleton3 = 'Different elements';
    
    let html = `
    <li class="comment-list-item">
        <div class="section-view">
            <div class="icon">
                <i class='bx bx-comment'></i>
            </div>
            <div class="body">
                <div class="content">
                    ${skeletonPrefix}${skeleton1}</div>
                    ${skeletonPrefix}${skeleton2}</div>
                    ${skeletonPrefix}${skeleton3}</div>
                </div>
                <div class="footer">
                    <small class="footer-date">
                        ${skeletonPrefix}45 minutes ago</div>
                    </small>
                    <div class="footer-buttons">
                        <div class="btn-link">${skeletonPrefix}</div></div>
                        <div class="btn-link">${skeletonPrefix}</div></div>
                    </div>
                </div>
            </div>
        </div>

    </li>`;

    return html;
}


PageComment.prototype.getDateDiffHtml = function() {
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

PageComment.prototype.getDateDiffTimeBlock = function() {
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

PageComment.prototype.getDateDiffUnitsDisplay = function(value, label) {
    if (value > 1) {
        return label + 's';
    } else {
        return label;
    }
}






