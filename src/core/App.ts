import { Color } from './Color';
import { Doc } from './Doc';
import { Layer } from './Layer';
import { Preferences } from './Preferences';
import { loadFilesAsBlobs, saveFile } from '../util/io';

import { Tool } from './tools/Tools';
import { Menu, MenuItemFunction, MenuItemCommand } from './Menu';
import { Pencil } from './tools/Pencil';
import { Panner } from './tools/Panner';
import { Fill } from './tools/Fill';
import { Move } from './tools/Move';
import { Eyedropper } from './tools/Eyedropper';
import { Zoom } from './tools/Zoom';
import { Command } from './Command';
import * as Commands from './Commands';
import * as Handlers from './formats/Handlers';

export class App {

  docs: Doc[] = [];
  activeDocIndex: number = 0;
  colorFg: Color = Color.fromHex("#e75952");
  colorBg: Color = Color.fromHex("#f9938a");
  palette: Color[];
  hash: number = 0;
  preferences: Preferences = new Preferences();
  menu: Menu;
  importHandlers: Handlers.BlobLoaderHandler[] = [
    new Handlers.PngHandler(this),
    new Handlers.PixelHandler(this)
  ];
  
  pencilTool: Pencil = new Pencil();
  eraserTool: Pencil = new Pencil();
  pannerTool: Tool = new Panner();
  fillTool: Tool = new Fill();
  moveTool: Tool = new Move();
  colorPickerTool: Tool = new Eyedropper();
  zoomTool: Tool = new Zoom();
  selectionMask: Layer;
  
  activeTool: Tool = this.pencilTool;
  overriddenTool: Tool = null;

  toolbar: Tool[] = [
    this.pencilTool,
    this.eraserTool,
    this.pannerTool,
    this.colorPickerTool,
    this.fillTool,
    this.moveTool,
    this.zoomTool
  ]

  constructor() {
    // redesign the eraser so these next lines aren't necessary
    this.eraserTool.isEraser = true;
    this.eraserTool.name = "Eraser";
    this.eraserTool.icon = "fas fa-eraser";

    // swiped from https://lospec.com/palette-list/enos16
    const txtPaletteTest = ["#fafafa", "#d4d4d4", "#9d9d9d", "#4b4b4b", "#f9d381", "#eaaf4d", "#f9938a", "#e75952", "#9ad1f9", "#58aeee", "#8deda7", "#44c55b", "#c3a7e1", "#9569c8", "#bab5aa", "#948e82"];
    // TODO: actually store these in the document and not just inline here for prototyping
    this.palette = txtPaletteTest.map((h) => Color.fromHex(h));


    // TODO: move somewhere else...
    // build the menu hierarchy
    this.menu = new Menu("Root", [
      new Menu("File", [
        new MenuItemCommand("New...", Commands.NewFile, this),
        new MenuItemCommand("Open...", Commands.OpenFile, this),
        new MenuItemCommand("Save...", Commands.SaveFile, this),
        new MenuItemCommand("Export...", Commands.QuickExport, this),
        new MenuItemCommand("Close", Commands.CloseFile, this),
        new MenuItemCommand("Close all", Commands.CloseAllFiles, this),
      ]),
      new Menu("Edit", [
        new MenuItemCommand("New Layer", Commands.NewLayer, this),
        new MenuItemCommand("Delete Layer", Commands.DeleteLayer, this),
      ]),
      // new Menu("Image", [
      //   new MenuItemCommand("New Layer", Commands.NewLayer, this),
      // ]),
      new Menu("Layer", [
        new MenuItemCommand("Duplicate", Commands.DuplicateLayer, this),
      ]),
    ]);
  }

  get activeDoc() {
    return this.docs[this.activeDocIndex];
  }

  set activeDoc(val) {
    this.activeDocIndex = this.docs.indexOf(val);
    this.activeDoc.touch();
  }

  undo() {
    this.activeTool.interrupt(); // don't let anything keep editing if you still have mousedown and hit ctrlz while painting for example
    this.activeDoc.history.undo();
  }

  redo() {
    this.activeTool.interrupt(); // don't let anything keep editing if you still have mousedown and hit ctrlz while painting for example
    this.activeDoc.history.redo();
  }

  selectTool(tool) {
    this.interruptActiveTool();
    this.activeTool = tool;
  }

  pushTool(tool) {
    if (this.overriddenTool) { return; }
    this.interruptActiveTool();
    this.overriddenTool = this.activeTool;
    this.activeTool = tool;
  }

  popTool() {
    if (!this.overriddenTool) { return; }
    this.interruptActiveTool();
    this.activeTool = this.overriddenTool;
    this.overriddenTool = null;
  }

  interruptActiveTool() {
    this.activeTool.interrupt();
    //this.activeDoc.activeLayerPreview = null;
    this.activeDoc.touch();
  }

  newDoc() {
    var doc = new Doc("New.pixel", 64, 64);
    doc.newLayer();
    this.docs.push(doc);
    this.activeDoc = doc;
  }

  closeDoc(doc) {
    // TODO: check if needs saving
    var index = this.docs.indexOf(doc);
    this.docs.splice(index, 1);
    this.activeDoc = this.docs[this.docs.length - 1];
  }

  closeAllDocs() {
    while (this.docs.length > 0) {
      this.closeDoc(this.docs[this.docs.length - 1]); // close from right to left
    }
  }

  addDoc(doc: Doc) {
    this.docs.push(doc);
    this.activeDoc = this.docs[this.docs.length - 1];
  }

  openFile() {
    loadFilesAsBlobs((blobs: Blob[]) => {
      blobs.forEach((blob) => {
        this.handleMysteriousIncomingBlob(blob);
      });
    });
  }

  handleMysteriousIncomingBlob(blob: Blob) {
    var foundHandler = false;
    for (let handler of this.importHandlers) {
      if (handler.test(blob)) {
        foundHandler = true;
        handler.action(blob);
        break;
      }
    }

    if (!foundHandler) {
      console.error("Couldn't handle file of type: " + blob.type);
    }
  }
}