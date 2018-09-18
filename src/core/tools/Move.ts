import { Tool, ToolContext } from "./Tools";
import { Vec } from "../Vec";

export class Move extends Tool {
  mouseIsDown = false;
  hasStartedMoving = false;
  lastPos = null;
  name = "Move";
  icon = "fas fa-arrows-alt";

  accum: Vec = new Vec(0, 0);

  getCssCursor(): string {
    return '';//this.mouseIsDown ? 'cursor-panner-closed' : 'cursor-panner-open';
  }

  interrupt() {
    this.mouseIsDown = false;
    this.lastPos = null;
    this.hasStartedMoving = false;
    this.accum = new Vec(0, 0);
  }

  doMoving(context: ToolContext) {
    if (this.mouseIsDown) {
      if (!this.hasStartedMoving) {
        this.hasStartedMoving = true;
        context.doc.historyPush("Move selection");
        context.doc.cloneLayer(context.doc.activeLayer);
      }
      if (this.lastPos) {
        var diff = context.pos.sub(this.lastPos);

        // offset has to be ints, so we keep a float Vec accumulator here and use only whole values from it
        this.accum = this.accum.add(diff);
        var rounded = this.accum.round();
        this.accum = this.accum.sub(rounded);

        context.doc.activeLayer.offset = context.doc.activeLayer.offset.add(rounded);
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
    this.interrupt();
  }
}