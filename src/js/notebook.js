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
    $(this).closest('.card-page').find('.content').removeClass('display-mode-normal');
    $(this).closest('.card-page').find('.content').addClass('display-mode-edit');
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

function loadPages() {
  const data = {
    function: constants.API_FUNCTIONS.getPages,
    notebookID: globalVariables.notebookID,
  }


  $.getJSON(constants.API, data, function(response) {
    for (let count = 0; count < response.length; count++)
      addPage(response[count]);

    displayPages();
    // console.log($('.card-page').html());
  });
}

function addPage(page) {
  const newPage = new Page(page);
  pagesList.push(newPage);
}

function displayPages() {
  
  let html = '';

  for (let count = 0; count < pagesList.length; count++) {
    html += pagesList[count].getHtml();
  }

  $('.pages').html(html);
}
































