import { Doc } from '../Doc';

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