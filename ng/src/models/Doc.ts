import { Layer } from './Layer';

export class Doc {
  name: string;
  width: number;
  height: number;
  layers: Layer[] = [];
  activeLayerIndex: number = 0;
  guid: string = "" + Math.random();
  isReady: boolean = true;
  hash: number = 0;

  constructor(name, width, height) {
    this.name = name;
    this.width = width;
    this.height = height;
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

  save() {
    localStorage.setItem('testSave', JSON.stringify(this));
  }

  static load() {
    var doc = JSON.parse(localStorage.getItem('testSave'));
    Object.setPrototypeOf(doc, Doc.prototype);
    doc.layers.forEach(layer => Object.setPrototypeOf(layer, Layer.prototype));
    return doc;
  }
}
