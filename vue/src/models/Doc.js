export class Doc {
  constructor(name, width, height) {
    this.name = name;
    this.width = width;
    this.height = height;
    this.layers = [];
    this.activeLayerIndex = 0;
    this.guid = "" + Math.random();
    this.isReady = true;
    this.hash = 0;
  }

  get activeLayer() {
    return this.layers[this.activeLayerIndex];
  }

  touch() {
    this.hash = Math.random();
  }

  newLayer() {
    this.layers.push(new Layer("Layer " + (this.layers.length + 1), this.width, this.height));
  }
}

export class Layer {
  constructor(name, width, height) {
    this.name = name;
    this.width = width;
    this.height = height;
    this.pixels = new Array(this.width * this.height * 4).fill(0);
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
}
