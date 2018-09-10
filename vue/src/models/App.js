import { Color } from './Color';
import { Doc } from './Doc';
import { newDocFromImage } from './ImageImporter';
import { Pencil, Panner } from './Tools';

export class App {
  pencilTool = new Pencil();
  pannerTool = new Panner();
  overriddenTool = null; //used to store whatever tool was open before we held down, say, space to pan
  docs = [];
  activeDocIndex = 0;
  activeTool = this.pencilTool;
  colorFg = Color.fromHex("#e75952");
  colorBg = Color.fromHex("#f9938a");
  palette = [];

  constructor() {
    this.docs.push(newDocFromImage("lunaAvatar_neutral_0.png", () => { }));
    this.docs.push(newDocFromImage("peepAvatar_neutral_0.png", () => { }));
    // swiped from https://lospec.com/palette-list/enos16
    const txtPaletteTest = ["#fafafa","#d4d4d4","#9d9d9d","#4b4b4b","#f9d381","#eaaf4d","#f9938a","#e75952","#9ad1f9","#58aeee","#8deda7","#44c55b","#c3a7e1","#9569c8","#bab5aa","#948e82"];
    // TODO: actually store these in the document and not just inline here for prototyping
    this.palette = txtPaletteTest.map((h) => Color.fromHex(h));
  }

  get activeDoc() {
    return this.docs[this.activeDocIndex];
  }
}