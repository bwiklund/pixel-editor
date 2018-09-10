import { Layer } from './Layer';

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

  // make a new headless layer of everything and return it.
  // TODO: cache this to save memory i guess
  createFinalBlit() {
    var finalLayer = new Layer("Headless compositing layer", this.width, this.height);
    this.layers.forEach((layer) => {
      if (!layer.isVisible) { return; }
      finalLayer.blitBlended(layer);
    });
    return finalLayer;
  }
}
