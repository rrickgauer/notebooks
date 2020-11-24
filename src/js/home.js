


// main
$(document).ready(function() {
  loadNotebooks();
});



function loadNotebooks() {
  const data = {
    function: API_FUNCTIONS.getNotebooks,
  }

  $.getJSON(API, data, function(response) {
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
      <h5><a href="${PAGES.notebook}?notebookID=${notebook.id}">${notebook.name}</a></h5>
      <p class="date-created">${notebook.date_created_display}</p>
    </div>
  </div>`;

  return html;
}