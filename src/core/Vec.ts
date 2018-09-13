export class Vec {
  x: number;
  y: number;

  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  copy() {
    return new Vec(this.x, this.y);
  }

  add(o) {
    return new Vec(this.x + o.x, this.y + o.y);
  }

  sub(o) {
    return new Vec(this.x - o.x, this.y - o.y);
  }

  mag() {
    return Math.sqrt(this.x * this.x + this.y * this.y);
  }

  scalarMult(n) {
    return new Vec(this.x * n, this.y * n);
  }

  round() {
    return new Vec(~~this.x, ~~this.y);
  }
}