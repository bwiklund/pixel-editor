import { Tool, ToolContext } from "./Tools";

export class Move extends Tool {
  mouseIsDown = false;
  lastPos = null;
  name = "Move";
  icon = "fas fa-arrows-alt";

  getCssCursor(): string {
    return '';//this.mouseIsDown ? 'cursor-panner-closed' : 'cursor-panner-open';
  }

  interrupt() {
    this.mouseIsDown = false;
    this.lastPos = null;
  }

  doMoving(context: ToolContext) {
    if (this.mouseIsDown) {
      if (this.lastPos) {
        var diff = context.pos.sub(this.lastPos);
        context.doc.activeLayer.offset = context.doc.activeLayer.offset.add(diff);
        context.doc.touch();
      }
      this.lastPos = context.pos.copy();
    }
  }

  onMouseDown(context: ToolContext) {
    this.mouseIsDown = true;
    this.doMoving(context);
  }

  onMouseMove(context: ToolContext) {
    this.doMoving(context);
  }

  onMouseUp(context: ToolContext) {
    this.mouseIsDown = false;
    this.doMoving(context);
    this.lastPos = null;
  }
}