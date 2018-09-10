import { Color } from './Color';
import { Doc } from './Doc';
import { newDocFromImage } from './ImageImporter';

export class App {
  //pencilTool = new Pencil();
  //pannerTool = new Panner();
  overriddenTool = null; //used to store whatever tool was open before we held down, say, space to pan
  docs = [];
  activeDocIndex = 0;
  activeTool = this.pencilTool;
  colorFg = Color.fromHex("#e75952");
  colorBg = Color.fromHex("#f9938a");

  constructor() {
    this.docs.push(newDocFromImage("lunaAvatar_neutral_0.png", () => { }));
    this.docs.push(newDocFromImage("peepAvatar_neutral_0.png", () => { }));
  }

  get activeDoc() {
    return this.docs[this.activeDocIndex];
  }
}