
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
    console.log(response);
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
  const href = `${CONSTANTS.PAGES.notebook}?notebookID=${notebook.id}&sort=${CONSTANTS.PAGE_SORTING.oldest}`;

  let description = notebook.description;
  if (description == null) {
    description = '';
  }

  let html = `
  <div class="card card-notebook">
    <div class="card-body">

      <div class="notebook-head">
        <h5><a href="${href}">${notebook.name}</a></h5>
        <div class="badges">
          <span class="badge badge-count-notes">${notebook.count_notes} notes</span>
          <span class="badge badge-count-checklists">${notebook.count_checklists} checklists</span>
        </div>
      </div>
      
      <p class="date-created">${notebook.date_created_display}</p>
      <p class="description">${description}</p>

    </div>
  </div>`;

  return html;
}