import {Color} from './Color';
import {Doc} from './Doc';

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
    this.docs.push(new Doc("Test 1",32,32));
    this.docs.push(new Doc("Test 2",32,32));
  }
}