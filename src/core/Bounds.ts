import { Vec } from './Vec';


export class Bounds {
  constructor(public tl: Vec, public br: Vec) { }

  get width() { return this.br.x - this.tl.x; }
  get height() { return this.br.y - this.tl.y; }

  contains(v: Vec) {
    return (
      v.x >= this.tl.x &&
      v.x <= this.br.x &&
      v.y >= this.tl.y &&
      v.y <= this.br.y
    );
  }

  newBoundsIncluding(v: Vec) {
    return new Bounds(
      new Vec(
        Math.min(this.tl.x, v.x),
        Math.min(this.tl.y, v.y)
      ),
      new Vec(
        Math.max(this.br.x, v.x),
        Math.max(this.br.y, v.y)
      )
    );
  }
}