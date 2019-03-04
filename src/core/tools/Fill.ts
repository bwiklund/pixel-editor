import { Tool, ToolContext } from "./Tools";
import { Color } from "../Color";
import { Vec } from "../Vec";
import { floodFill } from 'ts-flood-fill';

export class Fill extends Tool {
  name = "Fill";
  icon = "fas fa-fill";
  contiguous: boolean = true;

  getCssCursor(): string {
    return 'cursor-pencil';
  }

  onMouseMove(context: ToolContext) {
    var preview = context.doc.activeLayer.deepClone();
    var color = context.app.colorFg;
    preview.setPixel(context.pos, color.r, color.g, color.b, color.a);
    //context.doc.activeLayerPreview = preview;
    context.doc.touch();
  }

  onMouseDown(context: ToolContext) {
    context.doc.cloneLayer(context.doc.activeLayer);
    //context.doc.activeLayerPreview = null;

    if (this.contiguous) {
      this.floodFill(context);
    } else {
      this.globalReplaceColor(context);
    }

    context.doc.record("Fill");
  }

  floodFill(context: ToolContext) {
    floodFill(
      ~~context.pos.x,
      ~~context.pos.y,
      context.app.colorFg,
      (x, y) => context.doc.activeLayer.getColor(new Vec(x, y)),
      (x, y, c) => context.doc.activeLayer.setPixel(new Vec(x, y), c.r, c.g, c.b, c.a),
      (x, y) => context.doc.activeLayer.isInBounds(new Vec(x, y)),
      (a, b) => a.equalTo(b) || (a.a == 0 && b.a == 0)
    );

    context.doc.record("Flood fill");
  }

  globalReplaceColor(context: ToolContext) {
    const layer = context.doc.activeLayer;
    const color = context.app.colorFg;
    const targetColor = layer.getColor(context.pos);

    for (let y = 0; y < layer.height; y++) {
      for (let x = 0; x < layer.width; x++) {
        const v = new Vec(x, y);
        const currentColor = layer.getColor(v);
        if (currentColor.equalTo(targetColor)) {
          layer.setPixel(v, color.r, color.g, color.b, color.a);
        }
      }
    }
  }
}