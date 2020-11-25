const globalVariables = new GlobalVariables();
const CONSTANTS = new Constants();
const pagesList = [];


// main
$(document).ready(function() {
  loadPages();
  setNotebookActionStates();
  addListeners();
});


function addListeners() {
  $('#page-new-name').on('keyup', enableNewPageBtn);
  $('.btn-page-new-create').on('click', insertPage);


  $('.pages').on('click', '.btn-page-edit', function(e) {
    togglePageDisplayMode(this);
  });

  $('.pages').on('click', '.card-page .btn-page-update-cancel', function(e) {
    togglePageDisplayMode(this);
  });

  $('.pages').on('click', '.card-page .btn-page-update-save', function(e) {
    updateNoteContent(this);
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
    window.location.href = window.location.href;
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

    displayPages();
    loadChecklistsItems();

    // enable textarea library
    let utils = new Utilities();
    utils.enableTextarea('.edit-input');
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

  // sort the pages
  sortPagesList();

  for (let count = 0; count < pagesList.length; count++) {
    html += pagesList[count].getHtml();
  }

  $('.pages').html(html);
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
  $(selector).closest('.card-page').find('.content').toggleClass('display-mode-normal');
  $(selector).closest('.card-page').find('.content').toggleClass('display-mode-edit');
}

/////////////////////////////
// Update a note's content //
/////////////////////////////
function updateNoteContent(selector) {
  const note = $(selector).closest('.card-page');
  const noteID = $(note).attr('data-page-id');
  const newContent = $(note).find('.edit-input').val();

  const data = {
    function: CONSTANTS.API_FUNCTIONS.updateNote,
    noteID: noteID,
    content: newContent,
  }

  $.post(CONSTANTS.API, data).fail(function(response) {
    console.error('Error: updateNoteContent()');
    return;
  });

  // update the display
  let utils = new Utilities();

  const newContentMd = utils.renderMarkdown(newContent);
  $(note).find('.content .rendered').html(newContentMd);


  // show the new shit
  togglePageDisplayMode(selector);
}


//////////////////////////////////////////////////////////////
// render the note edit update markdown in the preview pane //
//////////////////////////////////////////////////////////////
function showNoteEditPreview(target) {
  const utils     = new Utilities();
  const note      = $(target).closest('.card-page');
  const editInput = $(note).find('.edit-input').val();
  const md        = utils.renderMarkdown(editInput);

  $(note).find('.tab-pane.preview').html(md);
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











