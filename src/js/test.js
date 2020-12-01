
const util = new Utilities();


$(document).ready(function() {
  initCodeMirror();
});




function initCodeMirror() {

  var editor = CodeMirror.fromTextArea(document.querySelector(".textarea-plus"), {
    mode: 'markdown',
    lineNumbers: false,
    theme: "default",
    extraKeys: {
      "Enter": "newlineAndIndentContinueMarkdownList",
      "F11": function(cm) {
        cm.setOption("fullScreen", !cm.getOption("fullScreen"));
      },
      "Esc": function(cm) {
        if (cm.getOption("fullScreen")) cm.setOption("fullScreen", false);
      }
    }
  });

}

