export class Layer {
  name: string;
  width: number;
  height: number;
  pixels: Uint8ClampedArray;
  isVisible: boolean;

  constructor(name, width, height) {
    this.name = name;
    this.width = width;
    this.height = height;
    this.pixels = new Uint8ClampedArray(this.width * this.height * 4).fill(0);
    this.isVisible = true;
  }

  setPixel(v, r, g, b, a) {
    if (v.x < 0 || v.x >= this.width || v.y < 0 || v.y >= this.height) {
      return;
    }

    var i = ~~(v.x) + ~~(v.y) * this.width;
    var I = i * 4;
    this.pixels[I + 0] = r;
    this.pixels[I + 1] = g;
    this.pixels[I + 2] = b;
    this.pixels[I + 3] = a;
  }

  drawLine(p1, p2, r, g, b, a) {
    // TODO: move this to a pencil tool class
    // first pass, just move <= 1 pixel at a time in the right direction.
    // this could be more efficient if i cared
    const offset = p2.sub(p1);
    const dist = offset.mag();
    const stepSize = 0.1;
    if (dist === 0) { // avoid NaN
      this.setPixel(p1, r, g, b, a);
    } else {
      for (let n = 0; n <= dist; n += stepSize) {
        const p = p1.add(offset.scalarMult(n / dist));

        this.setPixel(p, r, g, b, a);
      }
    }
  }

  blitBlended(otherLayer) {
    for (var y = 0; y < this.height; y++) {
      for (var x = 0; x < this.width; x++) {
        var i = x + y * this.width;
        var I = i * 4;

        var fAlpha = otherLayer.pixels[I + 3] / 255;
        var fAlphaOneMinus = 1 - fAlpha;

        var fAlphaMine = this.pixels[I + 3] / 255;

        this.pixels[I + 0] = ~~(this.pixels[I + 0] * fAlphaOneMinus + otherLayer.pixels[I + 0] * fAlpha);
        this.pixels[I + 1] = ~~(this.pixels[I + 1] * fAlphaOneMinus + otherLayer.pixels[I + 1] * fAlpha);
        this.pixels[I + 2] = ~~(this.pixels[I + 2] * fAlphaOneMinus + otherLayer.pixels[I + 2] * fAlpha);
        this.pixels[I + 3] = ~~(255 * (1 - (1 - fAlphaMine) * (1 - fAlpha)));
      }
    }
  }
}