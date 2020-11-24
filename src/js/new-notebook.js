const notebookNameInput = $('#notebook-new-name');
const createBtn = $('.btn-create-new-notebook');

$(document).ready(function() {
  $(createBtn).on('click', createNewNotebook);

  // remove invalid feedback class when user types
  $(notebookNameInput).on('keydown', function() {
    $(this).removeClass('is-invalid');
  });
});


function createNewNotebook() {
  const name = $(notebookNameInput).val();

  // verify that the name field has been filled out
  if (name == '') {
    const errorMsg = 'Please enter a name';
    $(notebookNameInput).closest('.form-group').find('.invalid-feedback').text(errorMsg);
    $(notebookNameInput).addClass('is-invalid');

    return;
  }

  const data = {
    function: API_FUNCTIONS.insertNotebook,
    name: name,
  }


  $.post(API, data, function(response) {
    response = JSON.parse(response);
    const url = PAGES.notebook + '?notebookID=' + response.id;
    window.location.href = url;
  });
}
