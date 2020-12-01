const CONSTANTS = new Constants();
const utilities = new Utilities();

// main
$(document).ready(function() {
  loadNotebooks();
  loadLabels();

  $('#notebooks-search-input').on('keyup', function() {
    searchNotebooks();
  });

  $('.notebooks-sort').on('click', function() {
    sortNotebooks(this);
  });

  $('.dropdown-labels-filter').on('click', '.dropdown-item-filter-label', function() {
    filterNotebooksByLabel(this);
  });

  $('.dropdown-item-clear-label-filters').on('click', function() {
    clearLabelFilters();
  });

});

function clearLabelFilters() {
  // show all notebooks
  $('.notebook').show();

  // remove all active classes
  $('.dropdown-labels-filter .dropdown-item-filter-label').removeClass('active'); 

}


function filterNotebooksByLabel(labelFilterBtn) {
  const buttonElement = $(labelFilterBtn).closest('.dropdown-item-filter-label');
  const filterID = $(buttonElement).attr('data-notebook-label-id');

  $(buttonElement).toggleClass('active');

  // initially hide all the filters
  $('.notebook').hide();

  // for each filter button active, show the notebooks that have that tag
  const activeFilterLabels = $('.dropdown-item-filter-label.active');
  for (let count = 0; count < activeFilterLabels.length; count++) {
    const labelID = $(activeFilterLabels[count]).attr('data-notebook-label-id');
    const selector = `.notebook .badge-notebook-label[data-label-id="${labelID}"]`;

    // show all the notebooks that have this label
    $(selector).closest('.notebook').show();
  }
}


function loadLabels() {
  const data = {
    function: CONSTANTS.API_FUNCTIONS.getNotebookLabels,
  }

  $.getJSON(CONSTANTS.API, data, function(response) {
    let html = '';
    for (let count = 0; count < response.length; count++) {
      html += getNotebookLabelFilterHtml(response[count]);
    }

    $('.dropdown-labels-filter .dropdown-menu-filter-list').html(html);

    // enable the dropdown
    $('.dropdown-labels-filter .dropdown-toggle').prop('disabled', false);
  }).fail(function(responose) {
    console.error('API error: loadLabels()');
    return;
  });
}

function getNotebookLabelFilterHtml(label) {
  const style = `background-color: ${label.color};`;
  const badge = `<span class="badge badge-notebook-label" style="${style}">${label.name}</span>`;
  const dataID = `data-notebook-label-id="${label.id}"`;
  
  let html = `<button class="dropdown-item dropdown-item-filter-label" ${dataID} type="button">${badge}</button>`;
  return html;
}


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
    displayNotebookLabels(response);
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
    
    <div class="description">${description}</div>

    <div class="labels"></div>

    <div class="page-counts">
      <span class="page-counts-item page-counts-date-created">
        <i class='bx bx-calendar'></i>
        <span class="page-count-data">${notebook.date_created_display}</span>
      </span>

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


function displayNotebookLabels(notebooks) {

  for (let count = 0; count < notebooks.length; count++) {
    getNotebookLabelsAssigned(notebooks[count].id);
  }
}


function getNotebookLabelsAssigned(notebookID) {
  const data = {
    function: CONSTANTS.API_FUNCTIONS.getNotebookLabelsAssigned,
    notebookID: notebookID,
  }

  $.getJSON(CONSTANTS.API, data, function(response) {
    let html = '';

    for (let count = 0; count < response.length; count++) {
      html += getNotebookLabelHtml(response[count]);
    }

    let selector = `.notebook[data-notebook-id="${notebookID}"] .labels`;
    $(selector).html(html);

  }).fail(function(response) {
    console.error('API error: getNotebookLabelsAssigned()');
    return;
  });
}

function getNotebookLabelHtml(label) {
  const style = `style="background-color: ${label.color};"`;
  const labelID = `data-label-id="${label.id}"`;
  const html = `<span ${labelID} class="badge badge-notebook-label mr-3 mt-3 mb-2" ${style}>${label.name}</span>`;

  return html;
}