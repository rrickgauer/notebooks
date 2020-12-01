
const CONSTANTS = new Constants();
const UTILS = new Utilities();
const globalVariables = new GlobalVariables();


// main
$(document).ready(function() {
  getNotebookLabels(displayNotebookLabels);
  addListeners();
});

function addListeners() {
  toggleNotebookDisplayMode();
  updateNotebookLabel();
  removeInvalidClassOnNameKeyUp();
  deleteNotebookLabel();
  insertNotebookLabel();
  removeInvalidClassOnNameNewKeyUp();
  cancelNewLabel();
}


function cancelNewLabel() {
  $('.btn-notebook-labels-new-cancel').on('click', function() {
    const nameInput = $('#form-notebook-labels-new-name');
    $(nameInput).val('');
    $('.new-label-section').removeClass('show');
  });
}


function insertNotebookLabel() {
  $('.btn-notebook-labels-new-save').on('click', function() {
    const nameInput = $('#form-notebook-labels-new-name');
    if ($(nameInput).val() == '') {
      $(nameInput).addClass('is-invalid');
      return;
    }

    const name = $(nameInput).val();
    const color = $('#form-notebook-labels-new-color').val();
    const data = {
      function: CONSTANTS.API_FUNCTIONS.insertNotebookLabel,
      name: name,
      color: color,
    }

    $.post(CONSTANTS.API, data, function(response) {
      window.location.href = window.location.href;
    }).fail(function(response) {
      console.error('API error: insertNotebookLabel()');
      return;
    });
  });
}


function deleteNotebookLabel() {
  $('.card-notebook-labels').on('click', '.btn-notebook-label-normal-delete', function() {
    if (!confirm('Are you sure you want to delete this label?')) {
      return;
    }

    const labelElement = $(this).closest('.notebook-label');
    const labelID = $(labelElement).attr('data-notebook-label-id');

    const data = {
      function: CONSTANTS.API_FUNCTIONS.deleteNotebookLabel,
      labelID: labelID,
    }

    $.post(CONSTANTS.API, data, function(response) {
      window.location.href = window.location.href;
    }).fail(function(response) {
      console.error('API error: deleteNotebookLabel()');
      return;
    });
  });
}


function updateNotebookLabel() {
  $('.card-notebook-labels').on('click', '.btn-notebook-labels-edit-save', function() {
    const labelElement = $(this).closest('.notebook-label');
    const nameInput = $(labelElement).find('.form-notebook-labels-edit-name');
    
    // verify the name input has a value
    if ($(nameInput).val() == '') {
      $(nameInput).addClass('is-invalid');
      return;
    }

    const labelID = $(labelElement).attr('data-notebook-label-id');
    const name = $(nameInput).val();
    const color = $(labelElement).find('.form-notebook-labels-edit-color').val();

    const data = {
      function: CONSTANTS.API_FUNCTIONS.updateNotebookLabel,
      labelID: labelID,
      name: name,
      color: color,
    }

    $.post(CONSTANTS.API, data, function(response) {
      window.location.href = window.location.href;
    }).fail(function(response) {
      console.error('API error: updateNotebookLabel()');
      return;
    });
  });

}

function removeInvalidClassOnNameKeyUp() {
  $('.card-notebook-labels').on('keyup', '.form-notebook-labels-edit-name', function() {
    if ($(this).val() != '') {
      $(this).removeClass('is-invalid');
      return;
    }
  });
}

function removeInvalidClassOnNameNewKeyUp() {
  $('#form-notebook-labels-new-name').on('keyup', function() {
    if ($(this).val() != '') {
      $(this).removeClass('is-invalid');
      return;
    }
  });
}


function toggleNotebookDisplayMode() {
  $('.card-notebook-labels').on('click', '.btn-notebook-label-normal-edit, .btn-notebook-labels-edit-cancel', function() {
    const labelElement = $(this).closest('.notebook-label');
    toggleEditMode(labelElement);
  });
}

function toggleEditMode(labelElement, display) {
  if (display == true) {
    $(labelElement).find('.display-normal').addClass('d-none');
    $(labelElement).find('.display-edit').removeClass('d-none');
  } else if (display == false) {
    $(labelElement).find('.display-edit').addClass('d-none');
    $(labelElement).find('.display-normal').removeClass('d-none');
  } else {
    $(labelElement).find('.display-edit').toggleClass('d-none');
    $(labelElement).find('.display-normal').toggleClass('d-none');
  }
}

function getNotebookLabels(actionSuccess) {
  const data = {
    function: CONSTANTS.API_FUNCTIONS.getNotebookLabels,
  }

  $.getJSON(CONSTANTS.API, data, function(response) {
    actionSuccess(response);
  }).fail(function(response) {
    console.error('API error: getNotebookLabels()');
    return;
  });
}


function displayNotebookLabels(labels) {
  let html = '';
  for (let count = 0; count < labels.length; count++) {
    html += getNotebookLabelListItemHtml(labels[count]);
  }

  $('.card-notebook-labels .list-group').html(html);
}


function getNotebookLabelListItemHtml(label) {
  const style = `background-color: ${label.color};`;
  const inputNameID = `form-notebook-labels-edit-name-${label.id}`;
  const inputColorID = `form-notebook-labels-edit-color-${label.id}`;
  const inputNameClass = 'form-notebook-labels-edit-name';
  const inputColorClass = 'form-notebook-labels-edit-color';

  let html = `
  <li class="list-group-item notebook-label" data-notebook-label-id="${label.id}">
    <div class="display-normal">
      <div class="label"><span class="badge badge-notebook-label" style="${style}">${label.name}</span>
      </div>
      <div class="notebook-label-actions">
        <button type="button" class="btn btn-sm btn-light btn-notebook-label-normal-edit">Edit</button>
        <button type="button" class="btn btn-sm btn-light btn-notebook-label-normal-delete">Delete</button>
      </div>
    </div>

    <div class="display-edit d-none">
      <form class="form-notebook-labels-edit">
        <div class="inputs">
          <!-- name -->
          <div class="item name">
            <label for="${inputNameID}">Name</label>
            <input type="text" id="${inputNameID}" class="form-control form-control-sm ${inputNameClass}" value="${label.name}">
            <div class="invalid-feedback">Please provide a name.</div>
          </div>
          <!-- color -->
          <div class="item color ml-3">
            <label for="${inputColorID}">Color</label>
            <input type="color" id="${inputColorID}" class="form-control form-control-sm ${inputColorClass}" value="${label.color}">
          </div>
        </div>
        <div class="buttons">
          <button type="button" class="btn btn-sm btn-success btn-notebook-labels-edit-save">Save changes</button>
          <button type="button" class="btn btn-sm btn-light btn-notebook-labels-edit-cancel">Cancel</button>
        </div>
      </form>
    </div>
  </li>`;

  return html;

}







