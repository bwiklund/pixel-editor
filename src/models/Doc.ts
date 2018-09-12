import { Layer } from './Layer';
import { Vec } from './Vec';
import { saveFile } from '../util/io';

export class Doc {
  name: string;
  width: number;
  height: number;
  layers: Layer[] = [];
  hash: number = 0;
  activeLayerIndex: number = 0;
  historyLabel: string = "";

  // a stack of copies of this document going back in time
  // we push and pop to this, but keep the reference to the original doc the same
  history: Doc[] = [];

  // todo: decide whether to serialize these on save or not.
  isReady: boolean = true;
  offset: Vec = new Vec(50, 50);
  zoom: number = 4;

  constructor(name, width, height) {
    this.name = name;
    this.width = width;
    this.height = height;
  }

  get activeLayer() {
    return this.layers[this.activeLayerIndex];
  }

  set activeLayer(layer: Layer) {
    var index = this.layers.indexOf(layer);
    if (index == -1) { throw new Error("That layer doesn't belong to this doc"); }
    this.activeLayerIndex = index;
  }

  // clone a layer before mutating it. this happens after history push
  cloneLayer(layer: Layer) {
    var index = this.layers.indexOf(layer);
    this.layers[index] = layer.deepClone();
  }

  touch() {
    this.hash = Math.random();
  }

  newLayer() {
    this.historyPush("New layer");
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
    saveFile(this.name, JSON.stringify(this), () => {
      // TODO: mark as saved
    });
  }

  static fromString(text) {
    var doc = JSON.parse(text);
    Object.setPrototypeOf(doc, Doc.prototype);
    doc.layers.forEach(layer => Object.setPrototypeOf(layer, Layer.prototype));
    return doc;
  }


  // history magic /////////////////////////////////////////////////////////////////
  historyPush(label: string) {
    this.historyLabel = label;
    var historyClone = this.shallowCloneForHistory();
    this.history.push(historyClone);

    // TODO: enforce a max history size or do we care?
  }

  historyPop() {
    if (this.history.length == 0) { return; }
    var prevState = this.history.pop();
    this.name = prevState.name;
    this.width = prevState.width;
    this.height = prevState.height;
    this.layers = prevState.layers;
    this.hash = prevState.hash;
    this.activeLayerIndex = prevState.activeLayerIndex;
    this.historyLabel = prevState.historyLabel;
  }

  shallowCloneForHistory(): Doc {
    var doc = new Doc(this.name, this.width, this.height);
    doc.layers = this.layers.slice();
    doc.hash = this.hash;
    doc.activeLayerIndex = this.activeLayerIndex;
    doc.historyLabel = this.historyLabel;
    return doc;
  }
}
