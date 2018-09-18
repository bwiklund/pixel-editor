import { Tool, ToolContext } from "./Tools";
import { Vec } from "../Vec";

export class Zoom extends Tool {
  mouseIsDown = false;
  lastPos = null;
  name = "Zoom";
  icon = "fas fa-search";

  initialDragSpot: Vec;

  getCssCursor(): string {
    return 'cursor-zoom';
  }

  interrupt() {
    this.mouseIsDown = false;
    this.lastPos = null;
    this.initialDragSpot = null;
  }

  doZooming(context: ToolContext) {
    if (this.mouseIsDown) {
      if (!this.initialDragSpot) {
        this.initialDragSpot = context.posInElement.copy();
      }

      if (this.lastPos) {
        var diff = context.posInElement.sub(this.lastPos);
        var newZoom = context.doc.zoom * Math.pow(2, 0.006 * context.app.preferences.scrollZoomSpeed * diff.x);
        context.doc.rezoom(this.initialDragSpot, newZoom);
      }
      this.lastPos = context.posInElement.copy();
    }
  }

  onMouseDown(context: ToolContext) {
    this.mouseIsDown = true;
    this.doZooming(context);
  }

  onMouseMove(context: ToolContext) {
    this.doZooming(context);
  }

  onMouseUp(context: ToolContext) {
    this.mouseIsDown = false;
    this.doZooming(context);
    this.interrupt();
  }
}