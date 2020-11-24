
const util = new Utilities();


$(document).ready(function() {

  $('.btn-render').on('click', render);

  util.enableTextarea('#input');


});



function render() {

  let input = $('#input').val();
  let md = util.renderMarkdown(input);

  $('.results').html(md);
}