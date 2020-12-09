const btnConfirmPassword = $('#form-notebook-delete-btn');
const inputPassword = $('#form-notebook-delete-password');
const invalidFeedbak = $('#form-notebook-delete-password-invalid-feedback');
const globalVariables = new GlobalVariables();
const CONTSTANTS = new Constants();

// main
$(document).ready(function() {
  addListeners();
});


function addListeners() {
  $(btnConfirmPassword).on('click', function() {
    confirmPassword();
  });

  $(inputPassword).on('keydown', function() {
    $(this).removeClass('is-invalid');
    setInvalidFeedbackText('');
  });
}


function confirmPassword() {
  if ($(inputPassword).val() == '') {
    setInvalidFeedbackText('Please enter your password');
    $(inputPassword).addClass('is-invalid');
    return;
  }

  disableButton();
  checkPassword($(inputPassword).val());
}

function disableButton() {
  let btnHtml = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>&nbsp;&nbsp;';
  $(btnConfirmPassword).prepend(btnHtml);
  $(btnConfirmPassword).prop('disabled', true);
}

function enableButton() {
  $(btnConfirmPassword).text('Confirm password');
  $(btnConfirmPassword).prop('disabled', false);
}


function checkPassword(password) {
  const data = {
    function: CONTSTANTS.API_FUNCTIONS.deleteNotebook,
    password: password,
    notebookID: globalVariables.notebookID,
  }

  $.post(CONTSTANTS.API, data, function(response) {
    window.location.href = 'home.php';
    exit;
  }).fail(function(response) {
    setInvalidFeedbackText('Invalid password');
    $(inputPassword).addClass('is-invalid');
    enableButton();
  });
}


function setInvalidFeedbackText(text) {
  $(invalidFeedbak).text(text);
}