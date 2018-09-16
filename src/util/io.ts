// must be called with a user input on the bottom of the stack i believe
export function loadFilesAsBlobs(done: Function) {
  var fileSelector = document.createElement('input');
  fileSelector.setAttribute('type', 'file');
  fileSelector.addEventListener("change", (e: Event) => {
    var el = <HTMLInputElement>e.target;
    done(Array.from(el.files));
  });

  fileSelector.click();
}

// must be called with a user input on the bottom of the stack i believe
export function saveFile(filename: string, mimeType: string, str: string, done: Function) {
  var a = document.createElement('a');
  a.setAttribute('href', 'data:' + mimeType + ',' + str);
  a.setAttribute('download', filename);
  a.click();
  done();
}

export function saveBlobFile(filename: string, blob, done: Function){
  var a = document.createElement('a');
  a.setAttribute('href', URL.createObjectURL(blob));
  a.setAttribute('download', filename);
  a.click();
  // i THINK i can immediately do this?
  URL.revokeObjectURL(blob);
  done();
}