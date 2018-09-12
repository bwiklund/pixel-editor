import { Vec } from "./Vec";

export class Layer {
  name: string;
  width: number;
  height: number;
  pixels: Uint8ClampedArray;
  isVisible: boolean;

  constructor(name: string, width: number, height: number) {
    this.name = name;
    this.width = width;
    this.height = height;
    this.pixels = new Uint8ClampedArray(this.width * this.height * 4).fill(0);
    this.isVisible = true;
  }

  setPixel(v: Vec, r: number, g: number, b: number, a: number) {
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

  blitBlended(otherLayer: Layer) {
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