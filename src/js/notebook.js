const globalVariables = new GlobalVariables();
const constants = new Constants();
const pagesList = [];


// main
$(document).ready(function() {
  loadPages();
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
  let apiFunction = constants.API_FUNCTIONS.insertNote;

  if (type != 'note')
    apiFunction = constants.API_FUNCTIONS.insertChecklist;

  const data = {
    function: apiFunction,
    name: name,
    notebookID: globalVariables.notebookID,
  }

  $.post(constants.API, data, function(response) {
    // reload the page if successful
    window.location.href = window.location.href;
  });
}


///////////////////////////////////////
// Loads all pages from the database //
///////////////////////////////////////
function loadPages() {
  const data = {
    function: constants.API_FUNCTIONS.getPages,
    notebookID: globalVariables.notebookID,
  }

  $.getJSON(constants.API, data, function(response) {
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

  for (let count = 0; count < pagesList.length; count++) {
    html += pagesList[count].getHtml();
  }

  $('.pages').html(html);
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
    function: constants.API_FUNCTIONS.getChecklistItems,
    checklistID: checklistID,
  }

  $.getJSON(constants.API, data, function(response) {
    let items = [];

    // build a list of ChecklistItem objects
    for (let count = 0; count < response.length; count++) {
      items.push(new ChecklistItem(response[count]));
    }

    // set the items
    pagesList[pagesListIndex].items = items;
    let checklistItemHtml =  pagesList[pagesListIndex].getHtml();

    let cards = $('.card-page');
    $(cards[pagesListIndex]).replaceWith(checklistItemHtml);
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
    function: constants.API_FUNCTIONS.updateNote,
    noteID: noteID,
    content: newContent,
  }

  $.post(constants.API, data).fail(function(response) {
    console.log('Error: updateNoteContent()');
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


////////////////////////////
// add new checklist item //
////////////////////////////
function addChecklistItem(selector) {

  const checklist   = $(selector).closest('.card-checklist');
  const checklistID = $(checklist).attr('data-page-id');
  const content     = $(checklist).find('.checklist-item-input').val();

  const data = {
    function: constants.API_FUNCTIONS.insertChecklistItem,
    checklistID: checklistID,
    content: content,
  }

  // todo: make the response faster when loading the new html
  $.post(constants.API, data, function(response) {
    loadChecklistsItems();
  })
  .fail(function(response) {
    console.log('error: addChecklistItem()');
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
    function: constants.API_FUNCTIONS.updateChecklistItemCompleted,
  }

   // send request to the api
  $.post(constants.API, data, function(response) {
    console.log(response);
  })
  .fail(function(response) {
    console.error('API error: checklistItemID()');
    return;
  });

  $(checklistItem).toggleClass('completed');
}




















