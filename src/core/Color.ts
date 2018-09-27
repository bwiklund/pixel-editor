import { hsvToRgb, rgbToHsv } from '../util/hsv.js';


// hsva is 0-1f
export class HSV {
  constructor(public h: number, public s: number, public v: number, public a: number = 1) { }

  copy() {
    return new HSV(this.h, this.s, this.v, this.a);
  }

  toRGB() {
    var rgbArray = hsvToRgb(this.h, this.s, this.v);
    return new Color(rgbArray[0], rgbArray[1], rgbArray[2], this.a * 255);
  }
}

// rgba is 0-255
export class Color {
  public r: number;
  public g: number;
  public b: number;
  public a: number;

  constructor(r: number, g: number, b: number, a: number = 255) {
    this.r = Math.round(r);
    this.g = Math.round(g);
    this.b = Math.round(b);
    this.a = Math.round(a);
  }

  static fromHex(hex: string) {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? new Color(
      parseInt(result[1], 16),
      parseInt(result[2], 16),
      parseInt(result[3], 16),
      255 // ;)
    ) : null;
  }

  copy() {
    return new Color(this.r, this.g, this.b, this.a);
  }

  equalTo(o: Color) {
    return this.r == o.r && this.g == o.g && this.b == o.b && this.a == o.a;
  }

  toHSV() {
    var hsvArray = rgbToHsv(this.r, this.g, this.b);
    return new HSV(hsvArray[0], hsvArray[1], hsvArray[2]);
  }

  toHex() {
    return "#" + ((1 << 24) + (~~this.r << 16) + (~~this.g << 8) + ~~this.b).toString(16).slice(1);
  }
}