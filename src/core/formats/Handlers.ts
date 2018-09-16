import { Doc } from '../Doc';
import { App } from '../App';
import { imgToLayer } from '../ImageImporter';

export interface Handler {
  test(Blob): boolean;
  action(Blob): void;
}

export class PngHandler implements Handler {
  constructor(public app: App) { }

  test(blob: Blob) {
    return new RegExp('^image/*').test(blob.type);
  }

  action(blob: Blob) {
    var reader = new FileReader();
    reader.onload = (event: Event) => {
      var img = new Image();
      img.src = <string>(<FileReader>event.target).result;
      img.onload = () => {
        var layer = imgToLayer(img);
        var doc = new Doc("New.pixel", layer.width, layer.height);
        doc.layers.push(layer);
        this.app.addDoc(doc);
      }
    };
    reader.readAsDataURL(blob);
  }
}

export class PixelHandler implements Handler {
  constructor(public app: App) { }

  test(blob: Blob) {
    return new RegExp('^application/json$').test(blob.type) || blob.type == "";
  }

  action(blob: Blob) {
    var reader = new FileReader();
    reader.onload = (event: Event) => {
      var doc = Doc.fromString(<string>(<FileReader>event.target).result);
      this.app.addDoc(doc);
    };
    reader.readAsText(blob);
  }
}

export function toPng(doc: Doc, done: Function) {
  var blitLayer = doc.createFinalBlit(true);
  var canvas = document.createElement('canvas');
  canvas.width = blitLayer.width;
  canvas.height = blitLayer.height;
  var ctx = canvas.getContext('2d');


  let idata = ctx.getImageData(0, 0, blitLayer.width, blitLayer.height);
  for (let y = 0; y < blitLayer.height; y++) {
    for (let x = 0; x < blitLayer.width; x++) {
      var i = x + y * blitLayer.width;
      var I = i * 4;

      // i guess this could just copy the whole array and not care about coords ATM but,
      // it won't always be 8 bit color necessarily
      idata.data[I + 0] = blitLayer.pixels[I + 0];
      idata.data[I + 1] = blitLayer.pixels[I + 1];
      idata.data[I + 2] = blitLayer.pixels[I + 2];
      idata.data[I + 3] = blitLayer.pixels[I + 3];
    }
  }
  ctx.putImageData(idata, 0, 0);

  canvas.toBlob((blob) => {
    done(blob);
  });
}

