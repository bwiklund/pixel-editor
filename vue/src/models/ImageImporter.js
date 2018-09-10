import { Doc } from './Doc';
import { Layer } from './Layer';

export function newDocFromImage(path, done) {
  let doc = new Doc(path, 1, 1);
  doc.isReady = false;

  const img = new Image();
  img.src = path; // TODO pull this out when i have more coherent plan for loading images
  img.onload = () => {
    // make a headless canvas to parse the png into pixels for us. this is not the canvas we draw the editor image to!
    let imageLoaderCanvas = document.createElement("canvas");
    imageLoaderCanvas.width = img.width;
    imageLoaderCanvas.height = img.height;
    let loaderCtx = imageLoaderCanvas.getContext('2d');
    loaderCtx.drawImage(img, 0, 0);
    let loaderData = loaderCtx.getImageData(0, 0, img.width, img.height);

    doc.height = img.height;
    doc.width = img.width;
    var layer = new Layer("Layer 1", img.width, img.height);
    layer.pixels = loaderData.data;
    doc.layers[0] = layer;
    doc.isReady = true;
    doc.touch();

    done();
  }

  //return this empty doc before the image is loaded, so the app has something to put in the docs array,
  //so loading speed doesn't make stuff you loaded async come in arbitrary order.
  return doc;
}
