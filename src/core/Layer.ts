import { Vec } from "./Vec";
import { Bounds } from './Bounds';
import { Color } from "./Color";


const BlendModes = {
  Replace(a: Color, b: Color) { return b; },

  Normal(a: Color, b: Color) {
    var fAlpha = b.a / 255;
    var fAlphaOneMinus = 1 - fAlpha;
    var fAlphaMine = a.a / 255;

    return new Color(
      a.r * fAlphaOneMinus + b.r * fAlpha,
      a.g * fAlphaOneMinus + b.g * fAlpha,
      a.b * fAlphaOneMinus + b.b * fAlpha,
      255 * (1 - (1 - fAlphaMine) * fAlphaOneMinus)
    );
  }
}

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
    this.pixels = new Uint8ClampedArray(this.width * this.height * 4);
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

  toInternalCoord(v: Vec): Vec {
    return v.sub(this.offset).round();
  }

  /** NOTE: Expects position in document space, not internal pixel buffer space */
  setPixel(v: Vec, r: number, g: number, b: number, a: number): void {
    return this.setPixelInternal(this.toInternalCoord(v), r, g, b, a);
  }

  /** NOTE: Expects position in document space, not internal pixel buffer space */
  getColor(v: Vec): Color {
    return this.getColorInternal(this.toInternalCoord(v));
  }

  setPixelInternal(v: Vec, r: number, g: number, b: number, a: number): void {
    if (!this.isInBounds(v)) { return; }

    var I = (v.x + v.y * this.width) * 4;
    this.pixels[I + 0] = r;
    this.pixels[I + 1] = g;
    this.pixels[I + 2] = b;
    this.pixels[I + 3] = a;
  }

  getColorInternal(v: Vec): Color {
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

  fillRect(tl: Vec, br: Vec, c: Color) {
    var actualTl = this.toInternalCoord(tl);
    var actualBr = this.toInternalCoord(br);
    for (var y = actualTl.y; y < actualBr.y; y++) {
      for (var x = actualTl.x; x < actualBr.x; x++) {
        var I = (x + y * this.width) * 4;
        this.pixels[I + 0] = c.r;
        this.pixels[I + 1] = c.g;
        this.pixels[I + 2] = c.b;
        this.pixels[I + 3] = c.a;
      }
    }
  }

  /** NOTE: Expects position in document space, not internal pixel buffer space */
  expandToFitOrReturnSelf(v: Vec) {
    var actualV = this.toInternalCoord(v);
    var bounds = new Bounds(this.offset, new Vec(this.width, this.height));
    var newBounds = bounds.newBoundsIncluding(actualV);

    // TODO: only resize if needed
    var newSelf = new Layer(this.name, newBounds.width, newBounds.height);
    newSelf.offset = new Vec(
      Math.min(this.offset.x, newBounds.tl.x),
      Math.min(this.offset.y, newBounds.tl.y)
    );
    newSelf.pixels = new Uint8ClampedArray(newBounds.width * newBounds.height * 4);
    newSelf.isVisible = this.isVisible;

    for (var y = 0; y < this.height; y++) {
      for (var x = 0; x < this.width; x++) {
        var oldPos = new Vec(x, y);
        var c = this.getColorInternal(oldPos);
        var newPos = oldPos.add(this.offset.sub(newSelf.offset));
        newSelf.setPixelInternal(newPos, c.r, c.g, c.b, c.a);
      }
    }

    return newSelf;
  }

  blitBlended(otherLayer: Layer, blendMode: (a: Color, b: Color) => Color = BlendModes.Normal, mask: Layer = null): void {
    var offsetDiff = otherLayer.offset.sub(this.offset).round();
    for (var y = 0; y < this.height; y++) {
      for (var x = 0; x < this.width; x++) {

        var myPos = new Vec(x, y);
        var theirPos = myPos.sub(offsetDiff);

        if (!otherLayer.isInBounds(theirPos)) {
          continue; // TODO: actually construct the loop bounds correctly from the start plz
        }

        var I = (x + y * this.width) * 4;
        var theirI = (theirPos.x + theirPos.y * otherLayer.width) * 4;

        var a = this.getColorInternal(myPos);
        var c = blendMode(a, otherLayer.getColorInternal(theirPos));
        if (mask) {
          var maskAmt = mask.getColorInternal(theirPos).a / 255;
          c = Color.lerp(a, c, maskAmt);
        }
        this.setPixelInternal(myPos, c.r, c.g, c.b, c.a);
      }
    }
  }

  moveMasked(mask: Layer, moveOffset: Vec): void {
    // make a copy of this layer, clear out where the mask was, and then use blitBlended to redraw it in the right place
    var copy = this.deepClone();
    copy.offset = copy.offset.add(moveOffset);
    this.blitBlended(new Layer("clear", this.width, this.height), BlendModes.Replace, mask);
    this.blitBlended(copy, BlendModes.Normal, mask);
  }
}