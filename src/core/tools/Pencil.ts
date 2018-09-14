import { Tool, ToolContext } from "./Tools";
import { Vec } from "../Vec";
import { Layer } from "../Layer";
import { Color } from "../Color";

export class Pencil extends Tool {
  mouseIsDown: boolean = false;
  lastPos: Vec = null;
  isEraser: boolean = false;
  name = "Pencil";
  icon = "fas fa-pencil-alt";
  size: number = 1;

  // hold onto this so we can change the brush size and update the canvas even if the mouse is idle (triggered from keypress)
  lastMousePositionContext: ToolContext;

  getCssCursor(): string {
    return 'cursor-pencil';
  }

  redrawBrushPreview() {
    if (this.lastMousePositionContext) {
      this.drawPencilStrokes(this.lastMousePositionContext);
    }
  }

  interrupt() {
    this.mouseIsDown = false;
    this.lastPos = null;
    if (this.lastMousePositionContext) { this.lastMousePositionContext.doc.activeLayerPreview = null; }
  }

  drawCircle(layer: Layer, pos: Vec, diameter: number, r: number, g: number, b: number, a: number) {
    if (diameter % 2 == 0) {
      pos = pos.add(new Vec(0.5, 0.5)); // make even sized diameters fall nicely...
    }

    if (diameter == 1) {
      layer.setPixel(pos, r, g, b, a);
      return;
    }

    var radius = diameter / 2;
    var radiusPlusOne = radius + 1;
    var tl = new Vec(~~Math.max(0, pos.x - radiusPlusOne), ~~Math.max(0, pos.y - radiusPlusOne));
    var br = new Vec(~~Math.min(layer.width, pos.x + radiusPlusOne), ~~Math.min(layer.height, pos.y + radiusPlusOne));
    for (var y = tl.y; y < br.y; y++) {
      for (var x = tl.x; x < br.x; x++) {
        var p = new Vec(x, y);
        if (p.copy().sub(pos).mag() <= radius) {
          layer.setPixel(new Vec(x, y), r, g, b, a);
        }
      }
    }
  }

  drawLine(layer: Layer, p1: Vec, p2: Vec, diameter: number, r: number, g: number, b: number, a: number) {
    const offset = p2.sub(p1);
    const dist = offset.mag();
    const stepSize = 0.1; // this is aggressively low right now (lots of sub-steps to draw line)
    if (dist === 0) { // avoid NaN
      var p = p1.round();
      this.drawCircle(layer, p, diameter, r, g, b, a);
    } else {
      for (let n = 0; n <= dist; n += stepSize) {
        let p = p1.add(offset.scalarMult(n / dist));
        p = p.round();

        this.drawCircle(layer, p, diameter, r, g, b, a);
      }
    }
  }

  drawPencilStrokes(context: ToolContext) {
    // FIXME should really just prevent any tool from getting events if the current doc isn't `ready`
    if (!context.doc || !context.doc.activeLayer) { return; }

    var color = context.app.colorFg;
    if (this.isEraser) color = new Color(0, 0, 0, 0);

    // TODO be able to lock a doc so you can't fumble and change layers midstroke, or trigger undo, etc

    if (this.mouseIsDown) {
      //NNcontext.doc.activeLayerPreview = null; // make sure this is clear
      if (!this.lastPos) {
        //context.doc.activeLayer.setPixel(context.pos, color.r, color.g, color.b, color.a);
        this.drawCircle(context.doc.activeLayer, context.pos.copy().round(), this.size, color.r, color.g, color.b, color.a);
      } else {
        this.drawLine(context.doc.activeLayer, context.pos, this.lastPos, this.size, color.r, color.g, color.b, color.a);
      }
      this.lastPos = context.pos.copy();
      context.doc.touch();
    } else {
      // just preview the brush
      var preview = context.doc.activeLayer.deepClone();
      this.drawCircle(preview, context.pos.copy().round(), this.size, color.r, color.g, color.b, color.a);
      context.doc.activeLayerPreview = preview;
    }
  }

  onMouseDown(context: ToolContext) {
    context.doc.historyPush("Pencil stroke");
    context.doc.cloneLayer(context.doc.activeLayer);

    this.mouseIsDown = true;
    this.drawPencilStrokes(context);
  }

  onMouseMove(context: ToolContext) {
    this.drawPencilStrokes(context);
    this.lastMousePositionContext = context;
  }

  onMouseUp(context: ToolContext) {
    this.mouseIsDown = false;
    this.drawPencilStrokes(context);
    this.lastPos = null;
  }
}