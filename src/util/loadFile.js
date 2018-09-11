// must be called with a user input on the bottom of the stack i believe
export function loadFile() {
  var fileSelector = document.createElement('input');
  fileSelector.setAttribute('type', 'file');
  fileSelector.addEventListener("change", (e) => {
    var files = e.target.files;
    var file = files[0]; // for now just handle one

    var reader = new FileReader();
    reader.onload = function(event) {
      console.log(event.target.result);
    };

    reader.readAsText(file);
  });

  fileSelector.click();
}