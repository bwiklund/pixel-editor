import { Tool, ToolContext } from "./Tools";
import { Color } from "../Color";

export class Eyedropper implements Tool {
  mouseIsDown: boolean = false;
  name = "Eyedropper";
  icon = "fas fa-eye-dropper";
  color: Color = new Color(0, 0, 0, 0);

  getCssCursor(): string {
    return 'cursor-eyedropper';
  }

  onMouseDown(context: ToolContext) {
    this.mouseIsDown = true;
    this.pickColor(context);
  }

  onMouseMove(context: ToolContext) {
    this.pickColor(context);
  }

  onMouseUp(context: ToolContext) {
    this.mouseIsDown = false;
    this.pickColor(context);
  }

  interrupt() {
    this.mouseIsDown = false;
  }

  pickColor(context: ToolContext) {
    this.color = context.doc.activeLayer.getColor(context.pos);

    if (this.color == null) {
      this.color = new Color(0, 0, 0, 0);
    }

    if (this.mouseIsDown) {
      context.app.colorFg = this.color;
    }
  }
}