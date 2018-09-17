export class Vec {
  constructor(public x: number, public y: number) { }

  copy() {
    return new Vec(this.x, this.y);
  }

  add(o: Vec) {
    return new Vec(this.x + o.x, this.y + o.y);
  }

  sub(o: Vec) {
    return new Vec(this.x - o.x, this.y - o.y);
  }

  mag() {
    return Math.sqrt(this.x * this.x + this.y * this.y);
  }

  scalarMult(n: number) {
    return new Vec(this.x * n, this.y * n);
  }

  round() {
    return new Vec(~~this.x, ~~this.y);
  }
}