const globalVariables = new GlobalVariables();


// main
$(document).ready(function() {
  $('#page-new-name').on('keyup', enableNewPageBtn);
  $('.btn-page-new-create').on('click', insertPage);  
});


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
    function: API_FUNCTIONS.insertNote,
    name: name,
    notebookID: globalVariables.notebookID,
  }

  $.post(API, data, function(response) {
    console.log('success');
  });
}



































