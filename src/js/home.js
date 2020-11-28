
const CONSTANTS = new Constants();
const utilities = new Utilities();

// main
$(document).ready(function() {
  loadNotebooks();

  $('#notebooks-search-input').on('keyup', function() {
    searchNotebooks();
  });

  $('.notebooks-sort').on('click', function() {
    sortNotebooks(this);
  });
});


function sortNotebooks(btn) {
  if ($(btn).hasClass('oldest')) {
    sortNotebooksOldest();
  } else if ($(btn).hasClass('newest')) {
    sortNotebooksNewest();
  } else {
    sortNotebooksName();
  }
}

function sortNotebooksOldest() {
  let notebooks = $('.notebook');
  notebooks.sort(function(a, b) {
    let dateA = new Date($(a).attr('data-notebook-date-created'));
    let dateB = new Date($(b).attr('data-notebook-date-created'));
    return (dateA < dateB) ? -1 : 1;
  });

  $('.list-notebooks').html(notebooks);

}

function sortNotebooksNewest() {
  let notebooks = $('.notebook');
  notebooks.sort(function(a, b) {
    let dateA = new Date($(a).attr('data-notebook-date-created'));
    let dateB = new Date($(b).attr('data-notebook-date-created'));
    return (dateA > dateB) ? -1 : 1;
  });

  $('.list-notebooks').html(notebooks);
}


function sortNotebooksName() {
  let notebooks = $('.notebook');
  notebooks.sort(function(a, b) {
    let nameA = $(a).attr('data-notebook-name');
    let nameB = $(b).attr('data-notebook-name');
    return (nameA < nameB) ? -1 : 1;
  });

  $('.list-notebooks').html(notebooks);
}






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
  const name = `data-notebook-name="${nameSearchData}"`;
  const notebookID = `data-notebook-id="${notebook.id}"`;
  const dateCreated = `data-notebook-date-created="${notebook.date_created}"`;
  


  let html = `
  <li class="list-group-item notebook" ${notebookID} ${name} ${dateCreated}>
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