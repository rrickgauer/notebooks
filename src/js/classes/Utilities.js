function Utilities() {
  this.data = null;
}


Utilities.prototype.renderMarkdown = function(input) {
  const MD_RENDER = window.markdownit();
  return MD_RENDER.render(input);
}


