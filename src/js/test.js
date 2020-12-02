
const util = new Utilities();


$(document).ready(function() {
  displayUUID();
});


function displayUUID() {
  for (let count = 0; count < 20; count++) {
    console.log(uuidv4());
  }
}





