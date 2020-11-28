
const CONSTANTS = new Constants();
const utilities = new Utilities();

// main
$(document).ready(function() {
  loadNotebooks();

  $('#notebooks-search-input').on('keyup', function() {
    searchNotebooks();
  });
});


function searchNotebooks() {
  const input = $('#notebooks-search-input').val().toUpperCase();
  if (input == '') {
    $('.notebook').removeClass('d-none');
  }

  $(`.notebook .name-search:not(:contains(${input}))`).closest('.notebook').addClass('d-none');
  $(`.notebook .name-search:contains(${input})`).closest('.notebook').removeClass('d-none');
}



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
  let html = '';

  for (let count = 0; count < notebooks.length; count++) {
    html += getNotebookCardHtml(notebooks[count]);
  }

  $('.list-notebooks').html(html);
}


function getNotebookCardHtml(notebook) {
  const href = `${CONSTANTS.PAGES.notebook}?notebookID=${notebook.id}&sort=${CONSTANTS.PAGE_SORTING.oldest}`;

  let description = notebook.description;
  if (description == null) {
    description = '';
  }

  const nameSearchData = notebook.name.toUpperCase();
  console.log(nameSearchData);

  let html = `
  <li class="list-group-item notebook">
    <div class="d-flex">
      <h5 class="name"><a href="${href}">${notebook.name}</a></h5>
    </div>

    <div class="name-search d-none">${nameSearchData}</div>
    
    <div class="date-created">
      <span>Added on </span>
      <span class="date-created-display">${notebook.date_created_display}</span>
    </div>
    <div class="description">${description}</div>

    <div class="page-counts">
      <span class="page-counts-item page-counts-notes">
        <i class='bx bx-note'></i>
        <span class="page-count-data">${notebook.count_notes}</span>
      </span>
      <span class="page-counts-item page-counts-checklists">
        <i class='bx bx-list-check'></i>
        <span class="page-count-data">${notebook.count_checklists}</span>
      </span>
    </div>
  </li>`;

  return html;
}