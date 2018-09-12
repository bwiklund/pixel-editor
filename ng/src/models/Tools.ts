import { Color } from './Color';
import { Vec } from './Vec';

export class Tool {
  onMouseDown(context) {

  }

  onMouseMove(context) {

  }

  onMouseUp(context) {

  }

  interrupt() { } // when stuff cuts off the tool mid-action and it needs to reset itself and clean up
}

export class Pencil extends Tool {
  mouseIsDown: boolean = false;
  lastPos: Vec = null;
  isEraser: boolean = false;

  interrupt() {
    this.mouseIsDown = false;
    this.lastPos = null;
  }

  drawPencilStrokes(context) {
    var color = context.app.colorFg;
    if (this.isEraser) color = new Color(0, 0, 0, 0);

    if (this.mouseIsDown) {
      if (!this.lastPos) {
        context.doc.activeLayer.setPixel(context.pos, color.r, color.g, color.b, color.a);
      } else {
        context.doc.activeLayer.drawLine(context.pos, this.lastPos, color.r, color.g, color.b, color.a);
      }
      this.lastPos = context.pos.copy();
      context.doc.touch();
    }
  }

  onMouseDown(context) {
    this.mouseIsDown = true;
    this.drawPencilStrokes(context);
  }

  onMouseMove(context) {
    this.drawPencilStrokes(context);
  }

  onMouseUp(context) {
    this.mouseIsDown = false;
    this.drawPencilStrokes(context);
    this.lastPos = null;
  }
}

export class Panner {
  mouseIsDown = false;
  lastPos = null;

  interrupt() {
    this.mouseIsDown = false;
    this.lastPos = null;
  }

  doPanning(context) {
    if (this.mouseIsDown) {
      if (this.lastPos) {
        var diff = context.posInElement.sub(this.lastPos);
        context.docView.offset = context.docView.offset.add(diff);
      }
      this.lastPos = context.posInElement.copy();
    }
  }

  onMouseDown(context) {
    this.mouseIsDown = true;
    this.doPanning(context);
  }

  onMouseMove(context) {
    this.doPanning(context);
  }

  onMouseUp(context) {
    this.mouseIsDown = false;
    this.doPanning(context);
    this.lastPos = null;
  }
}