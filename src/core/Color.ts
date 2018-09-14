import { hsvToRgb, rgbToHsv } from '../util/hsv.js';


// color class, colors are 0-255
export class Color {
  public r: number;
  public g: number;
  public b: number;
  public a: number;

  constructor(r: number, g: number, b: number, a: number) {
    this.r = ~~r;
    this.g = ~~g;
    this.b = ~~b;
    this.a = ~~a;
  }

  equalTo(o: Color) {
    return this.r == o.r && this.g == o.g && this.b == o.b && this.a == o.a;
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

  // expects 0-1 for hsv, returns 0-255 for rgb
  static fromHSV(h: number, s: number, v: number) {
    var rgbArray = hsvToRgb(h, s, v);
    return new Color(rgbArray[0], rgbArray[1], rgbArray[2], 255);
  }

  toHSV() {
    var hsvArray = rgbToHsv(this.r, this.g, this.b);
    return {
      h: hsvArray[0],
      s: hsvArray[1],
      v: hsvArray[2],
    };
  }

  toHex() {
    return "#" + ((1 << 24) + (~~this.r << 16) + (~~this.g << 8) + ~~this.b).toString(16).slice(1);
  }
}