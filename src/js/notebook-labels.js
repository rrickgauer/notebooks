
const CONSTANTS = new Constants();
const UTILS = new Utilities();
const globalVariables = new GlobalVariables();


// main
$(document).ready(function() {
  getNotebookLabels(displayNotebookLabels);
});


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
            <label for="form-notebook-labels-edit-name">Name</label>
            <input type="text" id="form-notebook-labels-edit-name" class="form-control form-control-sm" value="${label.name}">
          </div>
          <!-- color -->
          <div class="item color ml-3">
            <label for="form-notebook-labels-edit-color">Color</label>
            <input type="color" id="form-notebook-labels-edit-color" class="form-control form-control-sm" value="${label.color}">
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







