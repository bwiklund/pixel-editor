import { Color } from './Color';
import { Doc } from './Doc';
import { Tool, Pencil, Panner } from './Tools';
import { Preferences } from './Preferences';
import { loadFile, saveFile } from '../util/io';

export class App {
  pencilTool: Pencil = new Pencil();
  eraserTool: Pencil = new Pencil();
  pannerTool: Tool = new Panner();
  overriddenTool: Tool = null;
  docs: Doc[] = [];
  activeDocIndex: number = 0;
  activeTool: Tool = this.pencilTool;
  colorFg: Color = Color.fromHex("#e75952");
  colorBg: Color = Color.fromHex("#f9938a");
  palette: Color[];
  hash: number = 0;
  preferences: Preferences = new Preferences();

  constructor() {
    this.eraserTool.isEraser = true;
    // swiped from https://lospec.com/palette-list/enos16
    const txtPaletteTest = ["#fafafa", "#d4d4d4", "#9d9d9d", "#4b4b4b", "#f9d381", "#eaaf4d", "#f9938a", "#e75952", "#9ad1f9", "#58aeee", "#8deda7", "#44c55b", "#c3a7e1", "#9569c8", "#bab5aa", "#948e82"];
    // TODO: actually store these in the document and not just inline here for prototyping
    this.palette = txtPaletteTest.map((h) => Color.fromHex(h));
  }

  get activeDoc() {
    return this.docs[this.activeDocIndex];
  }

  pushTool(tool) {
    if (this.overriddenTool) return; // for now don't let this happen twice......
    this.activeTool.interrupt();
    this.overriddenTool = this.activeTool;
    this.activeTool = tool;
  }

  popTool() {
    if (!this.overriddenTool) return;
    this.activeTool.interrupt();
    this.activeTool = this.overriddenTool;
    this.overriddenTool = null;
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
    });
  }
}