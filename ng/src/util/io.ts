// must be called with a user input on the bottom of the stack i believe
export function loadFile(done: Function) {
  var fileSelector = document.createElement('input');
  fileSelector.setAttribute('type', 'file');
  fileSelector.addEventListener("change", (e) => {
    var files = <FileList>e.target.files;
    var file = files[0]; // for now just handle one

    var reader = new FileReader();
    reader.onload = function (event: ProgressEvent) {
      done(file.name, event.target.result);
    };

    reader.readAsText(file);
  });

  fileSelector.click();
}

// must be called with a user input on the bottom of the stack i believe
export function saveFile(filename: string, str: string, done: Function) {
  var a = document.createElement('a');
  a.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(str));
  a.setAttribute('download', filename);
  a.click();
}