const globalVariables = new GlobalVariables();
const CONSTANTS = new Constants();
const pagesList = [];
const UTILITIES = new Utilities();
const textareasList = [];


// main
$(document).ready(function() {
  loadPages();
  setNotebookActionStates();
  addListeners();

  loadLabelsAvailable();
  loadLabelsAssigned();
});

function addListeners() {
  $('#page-new-name').on('keyup', enableNewPageBtn);
  $('.btn-page-new-create').on('click', insertPage);
  
  $('#page-new-name').on('keydown', function(e) {
    if (e.keyCode == 13) {
      e.preventDefault();
      
      if ($(this).val() != '') {
        insertPage();
      }
    }
  });
  
  
  $('.pages').on('click', '.btn-page-edit', function(e) {
    togglePageDisplayMode(this);
    refreshTextarea(this);
  });
  
  $('.pages').on('click', '.card-page .btn-page-update-cancel', function(e) {
    resetTextarea(this);
    togglePageDisplayMode(this);
  });
  
  $('.pages').on('click', '.card-page .btn-page-update-save', function(e) {
    // updateNote(this);
    updatePage(this);
  });
  
  
  $('.pages').on('show.bs.tab', '.nav-link[data-toggle="tab"]', function(e) {
    showNoteEditPreview(e.target);
  });
  
  
  $('.pages').on('click', '.btn-checklist-item-add', function() {
    addChecklistItem(this);
  });
  
  // add item when enter key is hit
  $('.pages').on('keypress', '.checklist-item-input', function(e) {
    if (e.keyCode == 13) {
      e.preventDefault();
      addChecklistItem(this);
    }
  });
  
  $('.pages').on('change', '.form-check-input', function() {
    updateChecklistItemComplete(this);
  });
  
  $('.pages').on('click', '.btn-checklist-item-edit', function() {
    // don't do anything if the editor buttons are clicked
    if ($(this).hasClass('save')) {
      return;
    } else if ($(this).hasClass('cancel')) {
      return;
    }
    
    displayChecklistItemEditor(this);
  });
  
  $('.pages').on('click', '.btn-checklist-item-edit.save', function() {
    updateChecklistItemContent(this);
  });
  
  $('.pages').on('click', '.btn-checklist-item-edit.cancel', function() {
    cancelUpdateChecklistItemContent(this);
  });
  
  // btn-checklist-item-delete
  $('.pages').on('click', '.btn-checklist-item-delete', function() {
    deleteChecklistItem(this);
  });
  
  // refresh page if the pages sorting was changed
  $('input[name="notebook-action-sort"]').on('change', function() {
    refreshPage();
  });
  
  $('input[name="notebook-action-filter-type"]').on('change', function() {
    togglePageType(this);
  });
  
  // collapse all pages
  $('.btn-notebook-view-collapse').on('click', function() {
    collapsePage();
  });
  
  // expand all pages
  $('.btn-notebook-view-expand').on('click', function() {
    expandPage();
  });
  
  // collapse a single page
  $('.pages').on('click', '.btn-page-collapse', function() {
    collapsePage(this);
  });
  
  // expand a single page
  $('.pages').on('click', '.btn-page-expand', function() {
    expandPage(this);
  });
  
  // edit notebook
  $('.btn-notebook-meta-edit, .btn-notebook-meta-update-cancel').on('click', function() {
    $('.notebook-meta').toggleClass('d-none');
    $('.notebook-meta-edit').toggleClass('d-none');
  });
  
  // toggle the edit notbook meta section
  $('.btn-notebook-meta-update-save').on('click', function() {
    updateNotebookMetadata();
  });
  
  // remove the invalid class on keydown
  $('#notebook-edit-name').on('keydown', function() {
    $(this).removeClass('is-invalid');
  });
  
  // delete a page button clicked
  $('.pages').on('click', '.btn-page-delete', function() {
    deletePage(this);
  });
  
  // user wants to hide a page
  $('.pages').on('click', '.btn-page-hide', function() {
    togglePageHidden(this);
  });
  
  $('#notebook-action-hidden-toggle').on('click', function() {
    toggleHiddenPages();
  });
  
  $('.pages').on('keydown', '.edit-input', function(e) {
    if (e.keyCode == 13) {
      // autosize.update(this);
    }
  });

  // enable/disable create new label button
  $('#form-notebooks-labels-new-name').on('keyup', function() {
    if ($(this).val() != '') {
      $('#form-notebooks-labels-new-btn').prop('disabled', false);
    } else {
      $('#form-notebooks-labels-new-btn').prop('disabled', true);
    }
  });

  // creates a new notebook label
  $('#form-notebooks-labels-new-btn').on('click', function() {
    createNewNotebookLabel();
  });

  // assign the notebook a new label
  $('#form-notebooks-labels-assign-btn').on('click', function() {
    assignNotebookLabel();
  });

  // remove invalid class if the assign label select is changed
  $('#form-notebooks-labels-assign-label').on('change', function() {
    $(this).removeClass('is-invalid');
  });

  $('.assigned-labels-list').on('click', '.btn-notebook-label-remove', function() {
    removeAssignedNotebookLabel(this);
  });

}


/**
* Sets the notebook action states
* 
* sort
* page type
* hidden pages
* view
*/
function setNotebookActionStates() {
  // sort
  $(`input[name="notebook-action-sort"][value="${globalVariables.sort}"]`).prop('checked', true);
}

///////////////////////////////////////////////////////////////
// Disable the create new page button if name input is empty //
///////////////////////////////////////////////////////////////
function enableNewPageBtn() {
  if ($('#page-new-name').val().length > 0)
  $('.btn-page-new-create').prop('disabled', false);
  else
  $('.btn-page-new-create').prop('disabled', true);
}

////////////////////////
// Inserts a new page //
////////////////////////
function insertPage() {
  const name = $('#page-new-name').val();
  const type = $('input[name="page-new-type"]:checked').val();
  
  // determine which type of page to insert
  let apiFunction = CONSTANTS.API_FUNCTIONS.insertNote;
  
  if (type != 'note')
  apiFunction = CONSTANTS.API_FUNCTIONS.insertChecklist;
  
  const data = {
    function: apiFunction,
    name: name,
    notebookID: globalVariables.notebookID,
  }
  
  $.post(CONSTANTS.API, data, function(response) {
    // reload the page if successful
    refreshPage();
  });
}


///////////////////////////////////////
// Loads all pages from the database //
///////////////////////////////////////
function loadPages() {
  const data = {
    function: CONSTANTS.API_FUNCTIONS.getPages,
    notebookID: globalVariables.notebookID,
  }
  
  $.getJSON(CONSTANTS.API, data, function(response) {
    for (let count = 0; count < response.length; count++) {
      addPage(response[count]);
    }
    
    sortPagesList();
    displayPages();
    loadChecklistsItems();
    displayTableOfContent();
    
    // enable textarea library
    // let utils = new Utilities();
    // utils.enableTextarea('.edit-input');
    // utils.enableCodeMirror();
  });
}



/**
* Adds ids to all the page elements for the table of contents links
*/
function generatePageElementIds() {
  $('.card-page').each(function() {
    let index = $(this).index();
    let id = `page-${index}`;
    this.id = id;
  });
}


//////////////////////////////////////////////
// Insert a new page into the list of pages //
//////////////////////////////////////////////
function addPage(page) {
  // const newPage = new Note(page);
  
  if (page.page_type == 'checklist')
  pagesList.push(new Checklist(page));
  else
  pagesList.push(new Note(page));
}

/////////////////////////////////////////////////////////
// Runs down the list of pages and displays their html //
/////////////////////////////////////////////////////////
function displayPages() {
  let html = '';
  
  for (let count = 0; count < pagesList.length; count++) {
    html += pagesList[count].getHtml();
  }
  
  $('.pages').html(html);
  loadtextareasList();
  // autosize($('.edit-input'));
  
  Prism.highlightAll();
}


function loadtextareasList() {
  const textareaElements = document.getElementsByClassName('textarea-plus');

  for (let count = 0; count < textareaElements.length; count++) {
    textareasList.push(UTILITIES.enableCodeMirror(textareaElements[count]));
  }


}


function sortPagesList() {
  switch(globalVariables.sort) {
    case CONSTANTS.PAGE_SORTING.newest:             // newest
    pagesList.sort(function(a, b) {
      let dateA = new Date(a.dateCreated);
      let dateB = new Date(b.dateCreated);
      return (dateA > dateB) ? -1 : 1;
    }); break;
    case CONSTANTS.PAGE_SORTING.name:               // name
    pagesList.sort(function(a, b) {
      let nameA = a.name.toLowerCase();
      let nameB = b.name.toLowerCase();
      return (nameA < nameB) ? -1 : 1;
    }); break;
    default:                                        // oledest (default)
    pagesList.sort(function(a, b) {               
      let dateA = new Date(a.dateCreated);
      let dateB = new Date(b.dateCreated);
      return (dateA > dateB) ? -1 : 1;
    }); break;
  }
}



/////////////////////////////////////////
// loads all items into the checklists //
/////////////////////////////////////////
function loadChecklistsItems() {
  for (let count = 0; count < pagesList.length; count++) {
    if (pagesList[count] instanceof Checklist) {
      getChecklistItems(pagesList[count].id, count);
    }
  }
}

////////////////////////////////////////////
// Requests all the items for a checklist //
// Displays the items                     //
////////////////////////////////////////////
function getChecklistItems(checklistID, pagesListIndex) {
  const data = {
    function: CONSTANTS.API_FUNCTIONS.getChecklistItems,
    checklistID: checklistID,
  }
  
  $.getJSON(CONSTANTS.API, data, function(response) {
    let items = [];
    
    // build a list of ChecklistItem objects
    for (let count = 0; count < response.length; count++) {
      items.push(new ChecklistItem(response[count]));
    }
    
    // set the items
    pagesList[pagesListIndex].items = items;
    let checklistItemHtml =  pagesList[pagesListIndex].getHtmlBody();
    
    let cards = $('.card-page');
    $(cards[pagesListIndex]).find('.items').replaceWith(checklistItemHtml);
  });
  
}


/////////////////////////////////////////////////////
// Toggles a page's display mode to edit or normal //
/////////////////////////////////////////////////////
function togglePageDisplayMode(selector) {
  $(selector).closest('.card-page').toggleClass('display-mode-normal');
  $(selector).closest('.card-page').toggleClass('display-mode-edit');
}

/**
 * Sets the textarea value to the original value saved in the list
 */
function resetTextarea(btn) {
  const noteElement = $(btn).closest('.card-page');

  // get the text saved in the list of notes
  const pageIndex = getPageIndex(btn);
  let oldContent = pagesList[pageIndex].content;

  // set the corresponding codemirror textarea to the old content
  const noteIndex = getNoteIndex(btn) - 1;
  textareasList[noteIndex].setValue(oldContent);
}

function refreshTextarea(btn) {
  const noteElement = $(btn).closest('.card-page');

  // set the corresponding codemirror textarea to the old content
  const noteIndex = getNoteIndex(btn) - 1;
  textareasList[noteIndex].refresh();
}



/**
* Determines which type of page update to perform
*/
function updatePage(selector) {
  const pageElement = ($(selector).closest('.card-page'));
  if ($(pageElement).hasClass('card-note')) {
    updateNote(selector);
  } else {
    updateChecklist(selector);
  }
}

/**
* Update a checklist name
*/
function updateChecklist(selector) {
  const checklistElement = $(selector).closest('.card-page');
  const checklistID = $(checklistElement).attr('data-page-id');
  const name = $(checklistElement).find('.page-edit-name-input').val();
  
  // hidden
  const hidden = $(checklistElement).attr('data-page-hidden');
  
  const data = {
    function: CONSTANTS.API_FUNCTIONS.updateChecklist,
    checklistID: checklistID,
    name: name,
    hidden: hidden,
  }
  
  
  // send request to the api
  $.post(CONSTANTS.API, data).fail(function(response) {
    console.error('API error: updateChecklist()');
    return;
  });
  
  $(checklistElement).find('.card-page-name').text(name);
  togglePageDisplayMode(selector);
  
  // update the name in the pages array
  const pageIndex = getPageIndex(checklistElement);
  pagesList[pageIndex].name = name;
}


/**
* Update a note's:
* - content 
* - name
*/
function updateNote(selector) {
  const noteElement = $(selector).closest('.card-page');
  const noteID = $(noteElement).attr('data-page-id');

  const noteIndex = getNoteIndex(selector) - 1;
  const newContent = textareasList[noteIndex].getValue();
  
  const newName = $(noteElement).find('.page-edit-name-input').val();
  const hidden = $(noteElement).attr('data-page-hidden');
  
  const data = {
    function: CONSTANTS.API_FUNCTIONS.updateNote,
    noteID: noteID,
    content: newContent,
    name: newName,
    hidden: hidden,
  }
  
  $.post(CONSTANTS.API, data).fail(function(response) {
    console.error('Error: updateNote()');
    return;
  });
  
  
  // content
  const newContentMd = UTILITIES.renderMarkdown(newContent);
  $(noteElement).find('.content .rendered').html(newContentMd);
  
  // name
  $(noteElement).find('.card-page-name').text(newName);
  
  Prism.highlightAll();
  
  // show the new shit
  togglePageDisplayMode(selector);
  
  // update the element in the pages list
  const pageIndex = getPageIndex(noteElement);
  pagesList[pageIndex].name = newName;
  pagesList[pageIndex].content = newContent;
  
}


//////////////////////////////////////////////////////////////
// render the note edit update markdown in the preview pane //
//////////////////////////////////////////////////////////////
function showNoteEditPreview(target) {
  const note      = $(target).closest('.card-page');
  const editInput = $(note).find('.edit-input').val();
  const md        = UTILITIES.renderMarkdown(editInput);
  
  $(note).find('.tab-pane.preview').html(md);
  Prism.highlightAll();
}


//////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////
//                                          Checklists Shit
//////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////

////////////////////////////
// add new checklist item //
////////////////////////////
function addChecklistItem(selector) {
  
  const checklistElement   = $(selector).closest('.card-checklist');
  const checklistID = $(checklistElement).attr('data-page-id');
  const content     = $(checklistElement).find('.checklist-item-input').val();
  
  const pageIndex = getPageIndex(checklistElement);
  
  const data = {
    function: CONSTANTS.API_FUNCTIONS.insertChecklistItem,
    checklistID: checklistID,
    content: content,
  }
  
  // todo: make the response faster when loading the new html
  $.post(CONSTANTS.API, data, function(response) {
    getChecklistItems(checklistID, pageIndex);
    $(checklistElement).find('.checklist-item-input').val('');
  })
  .fail(function(response) {
    console.error('error: addChecklistItem()');
    return;
  });
}


/**
* Toggle the checklist item's completed state
*/
function updateChecklistItemComplete(checkbox) {
  const checklistItem = $(checkbox).closest('.checklist-item');
  const checklistItemID = $(checklistItem).attr('data-checklist-item-id');
  
  // set the completed status
  let completed = 'n';
  if (checkbox.checked) {
    completed = 'y';
  }
  
  const data = {
    checklistItemID: checklistItemID,
    completed: completed,
    function: CONSTANTS.API_FUNCTIONS.updateChecklistItemCompleted,
  }
  
  // send request to the api
  $.post(CONSTANTS.API, data).fail(function(response) {
    console.error('API error: checklistItemID()');
    return;
  });
  
  $(checklistItem).toggleClass('completed');
}


function getPageIndex(childElement) {
  const page = $(childElement).closest('.card-page');
  const pageIndex = $(page).index();
  return pageIndex;
}

function getNoteIndex(childElement) {
  const note = $(childElement).closest('.card-note');
  console.log($('.card-note'));
  const noteIndex = $(note).index();
  return noteIndex;
}

function getChecklistItemIndex(checklistItem) {
  return $(checklistItem).index();
}

function getChecklistItemObject(checklistItemElement) {
  const pageIndex = getPageIndex(checklistItemElement);
  const checklistItemIndex = getChecklistItemIndex(checklistItemElement);
  
  return pagesList[pageIndex].items[checklistItemIndex];
}

/**
* Display the editor for a checklist item
*/
function displayChecklistItemEditor(selector) {
  const checklistItemElement = $(selector).closest('.checklist-item');
  const checklistItem = getChecklistItemObject(checklistItemElement);
  const newHtml = checklistItem.getEditContentHtml();
  $(checklistItemElement).replaceWith(newHtml);
}

/**
* Update the checklist item's content
*/
function updateChecklistItemContent(btn) {
  const checklistItemElement = $(btn).closest('.checklist-item');
  const checklistItemID = $(checklistItemElement).attr('data-checklist-item-id');
  const content = $(checklistItemElement).find('.checklist-item-editor-input').val();
  
  const data = {
    function: CONSTANTS.API_FUNCTIONS.updateChecklistItemContent,
    content: content,
    checklistItemID: checklistItemID,
  }
  // send the data to the api
  $.post(CONSTANTS.API, data).fail(function(response) {
    console.error('api error: updateChecklistItemContent()');
    return;
  });
  
  // update the checklist item in the list
  let checklistItem = getChecklistItemObject(checklistItemElement);
  checklistItem.content = content;
  
  // update the array 
  let checklistItemIndex = getChecklistItemIndex(checklistItemElement);
  let checklistIndex = getPageIndex(checklistItemElement);
  pagesList[checklistIndex].items[checklistItemIndex] = checklistItem;
  
  // display the new html
  let html = checklistItem.getHtml();
  $(checklistItemElement).replaceWith(html);
}

/**
* Revert back to the original checklist item display
* 
* Canceled from editing
*/
function cancelUpdateChecklistItemContent(selector) {
  const checklistItemElement = $(selector).closest('.checklist-item');
  const checklistItem = getChecklistItemObject(checklistItemElement);
  const newHtml = checklistItem.getHtml();
  $(checklistItemElement).replaceWith(newHtml);
}


/**
* Remove the checklist item
*/
function deleteChecklistItem(selector) {
  const checklistItemElement = $(selector).closest('.checklist-item');
  const checklistItemID = $(checklistItemElement).attr('data-checklist-item-id');
  
  const data = {
    function: CONSTANTS.API_FUNCTIONS.deleteChecklistItem,
    checklistItemID: checklistItemID,
  }
  
  $.post(CONSTANTS.API, data).fail(function(response) {
    console.error('API Error: deleteChecklistItem()');
    return;
  });
  
  // remove the item from the list
  const pageIndex = getPageIndex(checklistItemElement);
  const checklistItemIndex = getChecklistItemIndex(checklistItemElement);
  pagesList[pageIndex].items.splice(checklistItemIndex, 1);
  
  // remove the html
  $(checklistItemElement).remove();
}

/**
* Refreshes the page by getting all the action states
*/
function refreshPage() {
  // get notebook id
  const notebookID = globalVariables.notebookID;
  
  // get the value of the selected sorting
  const sort = $('input[name="notebook-action-sort"]:checked').val();
  
  let newHref = `notebook.php?notebookID=${notebookID}&sort=${sort}`;
  window.location.href = newHref;
}


// toggle page visibility by type
function togglePageType(checkbox) {
  if ($(checkbox).val() == 'notes') {
    $('.card-note').toggleClass('d-none');
  } else {
    $('.card-checklist').toggleClass('d-none');
  }
}

/**
* Collapse either a single page or all pages
*/
function collapsePage(page) {
  // collapse all pages
  if (page == undefined) {
    $('.card-page').addClass('collapsed');
    return;
  }
  
  // collapse 1 page
  $(page).closest('.card-page').addClass('collapsed');
}


/**
* Expand either a single page or all pages
*/
function expandPage(page) {
  // expand all pages
  if (page == undefined) {
    $('.card-page').removeClass('collapsed');
    return;
  }
  
  // expand 1 page
  $(page).closest('.card-page').removeClass('collapsed');
}


// update the metadata
function updateNotebookMetadata() {
  const name = $('#notebook-edit-name').val();
  const notebookID = globalVariables.notebookID;
  const description = $('#notebook-edit-description').val();
  
  // make sure the name is not blank
  if (name == '') {
    $('#notebook-edit-name').addClass('is-invalid');
    return;
  }
  
  const data = {
    function: CONSTANTS.API_FUNCTIONS.updateNotebook,
    notebookID: notebookID,
    description: description,
    name: name,
  }
  
  $.post(CONSTANTS.API, data, function(response) {
    refreshPage();
    // console.log(JSON.parse(response));
  }).fail(function(response) {
    console.error('API error: updateNotebookMetadata()');
    return;
  });
}

/**
* Send request to the api to delete a checklist
*/
function deletePage(selector) {
  // confirm with user that they are sure they want to delete the page
  if (!confirm('Are you sure you want to delete this page?')) {
    return;
  }
  
  const pageElement = $(selector).closest('.card-page');
  const pageID = $(pageElement).attr('data-page-id');
  
  let data = null;
  if ($(pageElement).hasClass('card-checklist')) {
    data = {
      function: CONSTANTS.API_FUNCTIONS.deleteChecklist,
      checklistID: pageID,
    }
  } else {
    data = {
      function: CONSTANTS.API_FUNCTIONS.deleteNote,
      noteID: pageID,
    }
  }
  
  // send request to the API
  $.post(CONSTANTS.API, data, function(response) {
    refreshPage();
  }).fail(function(response) {
    console.error('API error: deletePage()');
    return;
  });
}


/**
* Toggle hidden pages all
*/
function toggleHiddenPages() {
  const checkbox = document.getElementById('notebook-action-hidden-toggle');
  // show hidden shit
  if (checkbox.checked) {
    $('.card-page[data-page-hidden="y"]').removeClass('d-none');
  } else {
    $('.card-page[data-page-hidden="y"]').addClass('d-none');
  }
}

/**
* Show/hide a page
*/
function togglePageHidden(selector) {
  const pageElement = $(selector).closest('.card-page');
  
  if ($(pageElement).attr('data-page-hidden') == 'n') {
    $(pageElement).attr('data-page-hidden', 'y');
    $(pageElement).addClass('d-none');
  } else {
    $(pageElement).attr('data-page-hidden', 'n');
  }
  
  updatePage(selector);
  if ($(pageElement).hasClass('display-mode-edit')) {
    togglePageDisplayMode(selector);
  }
}


// generate the toc
function displayTableOfContent() {
  generatePageElementIds();
  let html = '';
  
  $('.card-page').each(function() {
    if ($(this).attr('data-page-hidden') == 'n') {
      const pageID = this.id;
      const name = $(this).find('.card-page-name').text();
      html += `<li class="pages-toc-list-item"><a href="#${pageID}">${name}</a></li>`;
    }
  });
  
  $('.pages-toc-list').html(html);
}

/**
 * Creates a new notebook label
 * 
 * Adds it into the dropdown after it's created
 */
function createNewNotebookLabel() {
  const name = $('#form-notebooks-labels-new-name').val();
  const color = $('#form-notebooks-labels-new-color').val();

  const data = {
    function: CONSTANTS.API_FUNCTIONS.insertNotebookLabel,
    name: name,
    color: color,
  }

  $.post(CONSTANTS.API, data, function(response) {
    const newLabel = getLabelDropdownHtml(JSON.parse(response));
    $('#form-notebooks-labels-assign-label').append(newLabel);      // add to the select element
    $('#form-notebooks-labels-new-name').val('');                   // clear the text input
    $('#form-notebooks-labels-new-btn').prop('disabled', true);     // disable the create button

  }).fail(function(response) {
    console.error('API error: createNewNotebookLabel()');
    return;
  });
}

/**
 * Retrieve all the labels from the database
 */
function loadLabelsAvailable() {
  const data = {
    function: CONSTANTS.API_FUNCTIONS.getNotebookLabels,
  }

  $.getJSON(CONSTANTS.API, data, function(response) {
    displayAvailableLabels(response);
  }).fail(function(response) {
    console.error('API error: loadAvailableLables()');
    return;
  });
}

/**
 * Display the available labels into the dropdown #form-notebooks-labels-assign-label
 */
function displayAvailableLabels(labels) {
  let html = '';

  for (let count = 0; count < labels.length; count++) {
    html += getLabelDropdownHtml(labels[count]);
  }

  $('#form-notebooks-labels-assign-label').html(html);
}

function getLabelDropdownHtml(newLabel) {
  const html = `<option value="${newLabel.id}">${newLabel.name}</option>`;
  return html;
}

/**
 * Assign a label to a notebook
 */
function assignNotebookLabel() {
  const labelID = $('#form-notebooks-labels-assign-label option:checked').val();
  
  // verify that the label is not already assigned
  if (isLabelAlreadyAssigned(labelID)) {
    $('#form-notebooks-labels-assign-label').addClass('is-invalid');
    return;
  }

  let data = {
    function: CONSTANTS.API_FUNCTIONS.insertNotebookLabelsAssigned,
    labelID: labelID,
    notebookID: globalVariables.notebookID,
  }

  // send the request to the api
  $.post(CONSTANTS.API, data).fail(function(response) {
    console.error('API error: assignNotebookLabel');
    return;
  });


  data = {
    function: CONSTANTS.API_FUNCTIONS.getNotebookLabel,
    labelID: labelID,
  }

  // get the label data from the api
  // add the label to the assigned labels list
  $.getJSON(CONSTANTS.API, data, function(response) {
    console.log(response);
    let newLabel = '<li>' + getAssignedLabelHtml(response);
    newLabel += `<button class="btn btn-sm btn-notebook-label-remove"><i class='bx bx-x'></i></button>`;
    newLabel += '</li>';
    $('.assigned-labels-list').append(newLabel);
  });

}

// checks if the label is already assigned
function isLabelAlreadyAssigned(labelID) {
  const currentLabelIds = [];
  const currentLabels = $('.badge-notebook-label');

  // make an array of all the currently assigned label ids
  for (let count = 0; count < currentLabels.length; count++) {
    const id = $(currentLabels[count]).attr('data-label-id');
    currentLabelIds.push(id);
  }

  // if the id is included, return true
  // else return false
  if (currentLabelIds.includes(labelID)) {
    return true;
  } else {
    return false;
  }
}



/**
 * Loads all the assigned labels on page load
 */
function loadLabelsAssigned() {
  const data = {
    function: CONSTANTS.API_FUNCTIONS.getNotebookLabelsAssigned,
    notebookID: globalVariables.notebookID,
  }

  $.getJSON(CONSTANTS.API, data, function(response) {
    let html = '';
    for (let count = 0; count < response.length; count++) {
      html += '<li>';
      html += getAssignedLabelHtml(response[count]);
      html += `<button class="btn btn-sm btn-notebook-label-remove"><i class='bx bx-x'></i></button>`;
      html += '</li>';
    }

    $('.assigned-labels-list').html(html);

  }).fail(function(response) {
    console.error('API error: loadLabelsAssigned()');
    return;
  });
}

/**
 * Returns the html for an assigned notebook label badge
 */
function getAssignedLabelHtml(label) {
  const style = `style="background-color: ${label.color};"`;
  const labelID = `data-label-id="${label.id}"`;
  const html = `<span ${labelID} class="badge badge-notebook-label" ${style}>${label.name}</span>`;
  
  return html;
}

/**
 * Removes the assigned label from the notebook
 */
function removeAssignedNotebookLabel(btn) {
  const labelElement = $(btn).closest('li');
  const labelID = $(labelElement).find('.badge-notebook-label').attr('data-label-id');

  const data = {
    function: CONSTANTS.API_FUNCTIONS.deleteNotebookLabelAssigned,
    labelID: labelID,
    notebookID: globalVariables.notebookID,
  }

  $.post(CONSTANTS.API, data).fail(function(response) {
    console.error('API error: removeAssignedNotebookLabel()');
    return;
  });

  $(labelElement).remove();
}
