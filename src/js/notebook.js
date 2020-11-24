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

  const data = {
    function: constants.API_FUNCTIONS.insertNote,
    name: name,
    notebookID: globalVariables.notebookID,
  }

  $.post(constants.API, data, function(response) {
    console.log('success');
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
  });
}

//////////////////////////////////////////////
// Insert a new page into the list of pages //
//////////////////////////////////////////////
function addPage(page) {
  const newPage = new Page(page);
  pagesList.push(newPage);
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

  $.post(constants.API, data, function(response) {
    console.log(response);
  });
}




























