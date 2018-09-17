import { Layer } from './Layer';
import { Vec } from './Vec';
import { saveFile } from '../util/io';

export class Doc {
  name: string;
  width: number;
  height: number;
  needsUpdate: boolean = false;
  activeLayerIndex: number = 0;
  historyLabel: string = "";
  //activeLayerPreview: Layer = null;
  layers: Layer[] = [];

  // a stack of copies of this document going back in time
  // we push and pop to this, but keep the reference to the original doc the same
  history: Doc[] = [];

  // volatile unsaved stuff
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
    //this.activeLayerPreview = null; // throw away whatever tool preview we had
    this.activeLayerIndex = index;
  }

  // clone a layer before mutating it. this happens after history push
  cloneLayer(layer: Layer) {
    var index = this.layers.indexOf(layer);
    this.layers[index] = layer.deepClone();
  }

  touch() {
    this.needsUpdate = true;
  }

  newLayer() {
    this.historyPush("New layer");
    this.layers.push(new Layer("Layer " + (this.layers.length + 1), this.width, this.height));
    this.activeLayerIndex = this.layers.length - 1;
  }

  deleteLayers(layersToDelete: Layer[]) {
    this.historyPush("Delete layer(s)");
    var newLayers = this.layers.filter(l => !layersToDelete.includes(l));
    if (newLayers.length > 0) {
      this.layers = newLayers;
    } else {
      throw new Error("You can't delete all layers!");
    }
  }

  // make a new headless layer of everything and return it.
  // TODO: cache this to save memory i guess
  createFinalBlit(ignoreTempLayers: boolean = false) {
    var finalLayer = new Layer("Headless compositing layer", this.width, this.height);
    this.layers.forEach((layer) => {
      if (!layer.isVisible) { return; }
      // if (layer == this.activeLayer && this.activeLayerPreview != null && !ignoreTempLayers) {
      //   finalLayer.blitBlended(this.activeLayerPreview);
      // } else {
        finalLayer.blitBlended(layer);
      // }
    });
    return finalLayer;
  }

  // FIXME: the pixels should be saved in as compact a way as possible, which isn't how it is now...
  // or... just get it compact ([1,2,3,4]) and then zip the whole file. size is comparable to a single layer png that way.
  save() {
    var replacer = (k, v) => {
      // blacklist some keys we don't care to save
      if (k === "history" || k === "activeLayerPreview") {
        return undefined;
      } else if (k === "pixels") { // turn it into a plain int array
        return Array.from(v);
      } else {
        return v;
      }
    }

    saveFile(this.name, 'data:text/plain;charset=utf-8', JSON.stringify(this, replacer), () => {
      // TODO: mark as saved
    });
  }

  static fromString(text: string) {
    // TODO: make sure the serialized pixels turn back into Uint8Array's.
    // TODO: should i just make a new doc and then copy the params over??
    var doc = JSON.parse(text);
    Object.setPrototypeOf(doc, Doc.prototype);
    Object.setPrototypeOf(doc.offset, Vec.prototype);
    doc.layers.forEach((layer: Layer) => {
      Object.setPrototypeOf(layer, Layer.prototype);
      Object.setPrototypeOf(layer.offset, Vec.prototype);
    });
    doc.history = []; // start a new history
    return doc;
  }


  // history magic /////////////////////////////////////////////////////////////////
  historyPush(label: string) {
    //this.activeLayerPreview = null;

    this.historyLabel = label;
    var historyClone = this.shallowCloneForHistory();
    this.history.push(historyClone);
    this.touch();

    // TODO: enforce a max history size or do we care?
  }

  historyPop() {
    //this.activeLayerPreview = null;

    if (this.history.length == 0) { return; }
    var prevState = this.history.pop();
    this.name = prevState.name;
    this.width = prevState.width;
    this.height = prevState.height;
    this.layers = prevState.layers;
    this.activeLayerIndex = prevState.activeLayerIndex;
    this.historyLabel = prevState.historyLabel;
    this.touch();
  }

  shallowCloneForHistory(): Doc {
    var doc = new Doc(this.name, this.width, this.height);
    doc.layers = this.layers.slice();
    doc.needsUpdate = this.needsUpdate;
    doc.activeLayerIndex = this.activeLayerIndex;
    doc.historyLabel = this.historyLabel;
    return doc;
  }
}
