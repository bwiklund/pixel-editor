import { Layer } from './Layer';
import { Vec } from './Vec';
import { saveFile } from '../util/io';
import { UndoHistory } from 'undo-history';

export class Doc {
  name: string;
  width: number;
  height: number;
  needsUpdate: boolean = false;
  activeLayerIndex: number = 0;
  //activeLayerPreview: Layer = null;
  layers: Layer[] = [];

  // a stack of copies of this document going back in time
  // we push and pop to this, but keep the reference to the original doc the same
  history: UndoHistory<Doc>;

  // volatile unsaved stuff
  isReady: boolean = true;
  offset: Vec = new Vec(50, 50);
  zoom: number = 4;

  constructor(name, width, height) {
    this.name = name;
    this.width = width;
    this.height = height;
  }

  enableHistory() {
    this.history = new UndoHistory(50, this.shallowCloneForHistory.bind(this), this.setFromHistory.bind(this));
    this.history.record("Initial state");
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

  // clone a layer before mutating it. do this before you do work on a layer and before you write to history
  cloneLayer(layer: Layer) {
    this.layers = this.layers.slice(); // new instance of layers array, with same layer instances for memory compactness
    var index = this.layers.indexOf(layer);
    this.layers[index] = layer.deepClone(); // actually duplicate the layer we intend to modify
  }

  touch() {
    this.needsUpdate = true;
  }

  newLayer() {
    this.layers.push(new Layer("Layer " + (this.layers.length + 1), this.width, this.height));
    this.activeLayerIndex = this.layers.length - 1;
    
    this.record("New layer");
  }

  deleteLayers(layersToDelete: Layer[]) {
    var newLayers = this.layers.filter(l => !layersToDelete.includes(l));
    if (newLayers.length > 0) {
      this.layers = newLayers;
    } else {
      throw new Error("You can't delete all layers!");
    }
  
    this.record("Delete layer(s)");
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

  record(label: string) {
    this.history.record(label);
    console.log(this.history.states.map(s => s.label));
    this.touch();
  }

  undo() {
    console.log(this.history.states.map(s => s.label));
    this.history.undo();
  }

  redo() {
    this.history.redo();
  }

  setFromHistory(prevState: Doc) {
    this.name = prevState.name;
    this.width = prevState.width;
    this.height = prevState.height;
    this.layers = prevState.layers;
    this.activeLayerIndex = prevState.activeLayerIndex;
    this.touch();
  }

  shallowCloneForHistory(): Doc {
    var doc = new Doc(this.name, this.width, this.height);
    doc.layers = this.layers.slice();
    doc.needsUpdate = this.needsUpdate;
    doc.activeLayerIndex = this.activeLayerIndex;
    return doc;
  }

  rezoom(artboardMousePos: Vec, newZoom: number) {
    var zoomCoef = newZoom / this.zoom;
    var topCornerFromMouseOffset = artboardMousePos.sub(this.offset);
    var newOffset = artboardMousePos.sub(topCornerFromMouseOffset.scalarMult(zoomCoef));
    this.zoom = newZoom;
    this.offset = newOffset;
  }
}
