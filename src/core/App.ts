import { Color } from './Color';
import { Doc } from './Doc';
import { Preferences } from './Preferences';
import { loadFile, saveFile } from '../util/io';

import { Tool } from './tools/Tools';
import { Menu, MenuItem } from './Menu';
import { Pencil } from './tools/Pencil';
import { Panner } from './tools/Panner';
import { Fill } from './tools/Fill';
import { Eyedropper } from './tools/Eyedropper';

export class App {
  pencilTool: Pencil = new Pencil();
  eraserTool: Pencil = new Pencil();
  pannerTool: Tool = new Panner();
  fillTool: Tool = new Fill();
  colorPickerTool: Tool = new Eyedropper();
  overriddenTool: Tool = null;
  docs: Doc[] = [];
  activeDocIndex: number = 0;
  activeTool: Tool = this.pencilTool;
  colorFg: Color = Color.fromHex("#e75952");
  colorBg: Color = Color.fromHex("#f9938a");
  palette: Color[];
  hash: number = 0;
  preferences: Preferences = new Preferences();
  menu: Menu;

  toolbar: Tool[] = [
    this.pencilTool,
    this.eraserTool,
    this.pannerTool,
    this.colorPickerTool,
    this.fillTool,
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
        new MenuItem("New", () => console.log("you clicked me"))
      ]),
      new Menu("Edit", []),
      new Menu("Image", []),
    ]);
  }

  get activeDoc() {
    return this.docs[this.activeDocIndex];
  }

  undo() {
    this.activeTool.interrupt(); // don't let anything keep editing if you still have mousedown and hit ctrlz while painting for example
    this.activeDoc.historyPop();
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
    this.activeDoc.activeLayerPreview = null;
  }

  newDoc() {
    var doc = new Doc("New", 64, 64);
    doc.newLayer();
    this.docs.push(doc);
    this.activeDocIndex = this.docs.length - 1;
  }

  closeDoc(doc) {
    // TODO: check if needs saving
    var index = this.docs.indexOf(doc);
    this.docs.splice(index, 1);
    this.activeDocIndex = this.docs.length - 1;
  }

  openFile() {
    loadFile((path, str) => {
      var doc = Doc.fromString(str);
      doc.name = path;
      // TODO: complain if it can't be parsed
      this.docs.push(doc);
      this.activeDocIndex = this.docs.length - 1;
    });
  }
}