
const CONSTANTS = new Constants();

// main
$(document).ready(function() {
  loadNotebooks();
});



function loadNotebooks() {
  const data = {
    function: CONSTANTS.API_FUNCTIONS.getNotebooks,
  }

  $.getJSON(CONSTANTS.API, data, function(response) {
    displayNotebooks(response);
  });
}


function displayNotebooks(notebooks) {
  let html = '<div class="card-deck">';

  for (let count = 0; count < notebooks.length; count++) {
    // after 3 cards new line
    if (count % 3 == 0) {
      html += '</div><div class="card-deck">';
    }

    html += getNotebookCardHtml(notebooks[count]);
  }

  html += '</div>';

  $('.notebook-cards').html(html);
}


function getNotebookCardHtml(notebook) {

  let html = `
  <div class="card card-notebook">
    <div class="card-body">
      <h5><a href="${CONSTANTS.PAGES.notebook}?notebookID=${notebook.id}">${notebook.name}</a></h5>
      <p class="date-created">${notebook.date_created_display}</p>
    </div>
  </div>`;

  return html;
}