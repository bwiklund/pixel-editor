import { Tool, ToolContext } from "./Tools";
import { Color } from "../Color";
import { Vec } from "../Vec";

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
    context.doc.activeLayerPreview = preview;
  }

  onMouseDown(context: ToolContext) {
    context.doc.historyPush("Fill");
    context.doc.cloneLayer(context.doc.activeLayer);
    context.doc.activeLayerPreview = null;

    if (this.contiguous) {
      this.floodFill(context);
    } else {
      this.globalReplaceColor(context);
    }
  }

  floodFill(context: ToolContext) {
    var layer = context.doc.activeLayer;
    var targetColor = layer.getColor(context.pos);;
    var replacementColor = context.app.colorFg

    if (targetColor.equalTo(replacementColor)) { return; }

    var queue: Vec[] = [];
    queue.push(context.pos);

    while (queue.length > 0) {
      var nodePos = queue.pop();
      var directions = [
        nodePos.add(new Vec(0, -1)),
        nodePos.add(new Vec(1, 0)),
        nodePos.add(new Vec(0, 1)),
        nodePos.add(new Vec(-1, 0))
      ];

      for (var i = 0; i < directions.length; i++) {
        var newPos = directions[i];
        if (layer.isInBounds(newPos)) {
          var newNodeColor = layer.getColor(newPos);
          if (newNodeColor.equalTo(targetColor)) {
            layer.setPixel(newPos, replacementColor.r, replacementColor.g, replacementColor.b, replacementColor.a);
            queue.push(newPos);
          }
        }
      }
    }
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