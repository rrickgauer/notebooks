

// main
$(document).ready(function() {
  
  $('#page-new-name').on('keyup', enableNewPageBtn);  
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



































