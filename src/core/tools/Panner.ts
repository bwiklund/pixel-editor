import { Tool, ToolContext } from "./Tools";

export class Panner extends Tool {
  mouseIsDown = false;
  lastPos = null;
  name = "Panner";
  icon = "fas fa-hand-paper";

  getCssCursor(): string {
    return this.mouseIsDown ? 'cursor-panner-closed' : 'cursor-panner-open';
  }

  interrupt() {
    this.mouseIsDown = false;
    this.lastPos = null;
  }

  doPanning(context: ToolContext) {
    if (this.mouseIsDown) {
      if (this.lastPos) {
        var diff = context.posInElement.sub(this.lastPos);
        context.doc.offset = context.doc.offset.add(diff);
      }
      this.lastPos = context.posInElement.copy();
    }
  }

  onMouseDown(context: ToolContext) {
    this.mouseIsDown = true;
    this.doPanning(context);
  }

  onMouseMove(context: ToolContext) {
    this.doPanning(context);
  }

  onMouseUp(context: ToolContext) {
    this.mouseIsDown = false;
    this.doPanning(context);
    this.lastPos = null;
  }
}