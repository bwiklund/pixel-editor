import { Color } from './Color';
import { Layer } from './Layer';
import { Vec } from './Vec';
import { App } from './App';
import { Doc } from './Doc';
import { DocViewComponent } from '../app/doc-view/doc-view.component';

export interface ToolContext {
  app: App,
  doc: Doc,
  pos: Vec,
  posInElement: Vec
}

export class Tool {
  name: string;
  icon: string;

  onMouseDown(context: ToolContext) {

  }

  onMouseMove(context: ToolContext) {

  }

  onMouseUp(context: ToolContext) {

  }

  interrupt() { } // when stuff cuts off the tool mid-action and it needs to reset itself and clean up
}

export class Pencil extends Tool {
  mouseIsDown: boolean = false;
  lastPos: Vec = null;
  isEraser: boolean = false;
  name = "Pencil";
  icon = "fas fa-pencil-alt";
  size: number = 1;

  interrupt() {
    this.mouseIsDown = false;
    this.lastPos = null;
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
    var br = new Vec(~~Math.min(layer.width - 1, pos.x + radiusPlusOne), ~~Math.min(layer.height - 1, pos.y + radiusPlusOne));
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
    var color = context.app.colorFg;
    if (this.isEraser) color = new Color(0, 0, 0, 0);

    if (this.mouseIsDown) {
      if (!this.lastPos) {
        //context.doc.activeLayer.setPixel(context.pos, color.r, color.g, color.b, color.a);
        this.drawCircle(context.doc.activeLayer, context.pos.copy().round(), this.size, color.r, color.g, color.b, color.a);
      } else {
        this.drawLine(context.doc.activeLayer, context.pos, this.lastPos, this.size, color.r, color.g, color.b, color.a);
      }
      this.lastPos = context.pos.copy();
      context.doc.touch();
    }
  }

  onMouseDown(context: ToolContext) {
    this.mouseIsDown = true;
    this.drawPencilStrokes(context);
  }

  onMouseMove(context: ToolContext) {
    this.drawPencilStrokes(context);
  }

  onMouseUp(context: ToolContext) {
    this.mouseIsDown = false;
    this.drawPencilStrokes(context);
    this.lastPos = null;
  }
}

export class Panner {
  mouseIsDown = false;
  lastPos = null;
  name = "Panner";
  icon = "fas fa-hand-paper";

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

export class ColorPicker extends Tool {
  mouseIsDown: boolean = false;
  name = "ColorPicker";
  icon = "fas fa-eye-dropper";
  color: Color = new Color(0, 0, 0, 0);

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
export class Fill extends Tool {
  name = "Fill";
  icon = "fas fa-fill";
  contiguous: boolean = true;

  onMouseDown(context: ToolContext) {
    if (this.contiguous) {
      this.floodFill(context);
    } else {
      this.globalReplaceColor(context);
    }
  }

  floodFill(context: ToolContext) {
    var layer = context.doc.activeLayer;
    var targetColor = layer.getColor(context.pos);;
    var replacementColor = context.app.colorFg;

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