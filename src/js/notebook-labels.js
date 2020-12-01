
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







