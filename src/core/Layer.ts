import { Vec } from "./Vec";
import { Color } from "./Color";

export class Layer {
  name: string;
  width: number;
  height: number;
  pixels: Uint8ClampedArray;
  isVisible: boolean;
  offset: Vec = new Vec(0, 0);

  constructor(name: string, width: number, height: number) {
    this.name = name;
    this.width = width;
    this.height = height;
    this.isVisible = true;
    this.pixels = new Uint8ClampedArray(this.width * this.height * 4).fill(0);
  }

  deepClone(): Layer {
    var copy = new Layer(this.name, this.width, this.height);
    copy.pixels = this.pixels.slice();
    copy.offset = this.offset.copy();
    this.isVisible = this.isVisible;
    return copy;
  }

  isInBounds(v: Vec): boolean {
    return !(v.x < 0 || v.x >= this.width || v.y < 0 || v.y >= this.height);
  }

  /** NOTE: This takes care of `offset` internally */
  setPixel(v: Vec, r: number, g: number, b: number, a: number) {
    v = v.sub(this.offset).round();
    if (!this.isInBounds(v)) { return; }

    var I = (v.x + v.y * this.width) * 4;
    this.pixels[I + 0] = r;
    this.pixels[I + 1] = g;
    this.pixels[I + 2] = b;
    this.pixels[I + 3] = a;
  }

  /** NOTE: This takes care of `@offset` internally */
  getColor(v: Vec): Color {
    v = v.sub(this.offset).round();
    if (!this.isInBounds(v)) { return null; }

    var i = ~~(v.x) + ~~(v.y) * this.width;
    var I = i * 4;

    return new Color(
      this.pixels[I + 0],
      this.pixels[I + 1],
      this.pixels[I + 2],
      this.pixels[I + 3]
    );
  }

  blitBlended(otherLayer: Layer) {
    var offsetDiff = otherLayer.offset.sub(this.offset).round();
    for (var y = 0; y < this.height; y++) {
      for (var x = 0; x < this.width; x++) {

        var myPos = new Vec(x,y);
        var theirPos = myPos.sub(offsetDiff);

        if (!otherLayer.isInBounds(theirPos)) {
          continue; // TODO: actually construct the loop bounds correctly from the start plz
        }

        var I = (x + y * this.width) * 4;
        var theirI = (theirPos.x + theirPos.y * otherLayer.width) * 4;

        var fAlpha = otherLayer.pixels[theirI + 3] / 255;
        var fAlphaOneMinus = 1 - fAlpha;

        var fAlphaMine = this.pixels[I + 3] / 255;

        this.pixels[I + 0] = ~~(this.pixels[I + 0] * fAlphaOneMinus + otherLayer.pixels[theirI + 0] * fAlpha);
        this.pixels[I + 1] = ~~(this.pixels[I + 1] * fAlphaOneMinus + otherLayer.pixels[theirI + 1] * fAlpha);
        this.pixels[I + 2] = ~~(this.pixels[I + 2] * fAlphaOneMinus + otherLayer.pixels[theirI + 2] * fAlpha);
        this.pixels[I + 3] = ~~(255 * (1 - (1 - fAlphaMine) * (1 - fAlpha)));
      }
    }
  }
}