const notebookNameInput = $('#notebook-new-name');
const createBtn = $('.btn-create-new-notebook');
const CONSTANTS = new Constants();
const notebookDescriptionInput = $('#notebook-new-description');

$(document).ready(function() {
  $(createBtn).on('click', createNewNotebook);

  // remove invalid feedback class when user types
  $(notebookNameInput).on('keydown', function() {
    $(this).removeClass('is-invalid');
  });
});


function createNewNotebook() {
  const name = $(notebookNameInput).val();
  const description = $(notebookDescriptionInput).val();

  // verify that the name field has been filled out
  if (name == '') {
    const errorMsg = 'Please enter a name';
    $(notebookNameInput).closest('.form-group').find('.invalid-feedback').text(errorMsg);
    $(notebookNameInput).addClass('is-invalid');

    return;
  }

  const data = {
    function: CONSTANTS.API_FUNCTIONS.insertNotebook,
    name: name,
    description: description,
  }


  $.post(CONSTANTS.API, data, function(response) {
    response = JSON.parse(response);
    const url = CONSTANTS.PAGES.notebook + '?notebookID=' + response.id;
    window.location.href = url;
  });
}