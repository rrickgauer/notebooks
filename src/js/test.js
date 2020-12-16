
const util = new Utilities();
const CONSTANTS = new Constants();


$(document).ready(function() {

    // getNotebookAll();
    getNotebookAll2();

});


function getNotebookAll() {

    const data = {
        function: CONSTANTS.API_FUNCTIONS.getNotebookAll,
        notebookID: 13,
    }

    $.getJSON(CONSTANTS.API, data, function(response) {
        console.table(response);
    });
}


function getNotebookAll2() {

    const data = {
        function: CONSTANTS.API_FUNCTIONS.getNotebookAll2,
        notebookID: 13,
    }

    $.getJSON(CONSTANTS.API, data, function(response) {
        console.table(response);
    });
}







