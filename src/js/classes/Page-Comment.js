

function PageComment(inputParm) {

    if (inputParm != null) {
        this.id = inputParm.id;
        this.checklist_id = inputParm.checklist_id;
        this.content = inputParm.content;
        this.date_created = inputParm.date_created;
        this.type = inputParm.type;
    }


}


PageComment.prototype.getHtml = function() {

    let html = `
    <li class="comment-list-item" data-comment-id="${this.id}">
        <div class="icon">
            <i class='bx bx-comment'></i>
        </div>
        <div class="body">
            <div class="content">${this.content}</div>
            <div class="footer">
                <small class="footer-date">
                    <span class="footer-date-time">46</span>&nbsp;<span class="footer-date-unit">minutes</span>&nbsp;ago
                </small>
                <div class="footer-buttons">
                    <button class="btn-link">Edit</button>
                    <button class="btn-link">Update</button>
                </div>
            </div>
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
    </li>`;

    return html;
}






