import { Component, ViewChild, ElementRef, Input, DoCheck, HostListener } from '@angular/core';
import { App, Doc, Vec } from '../../core';
import { ToolContext } from '../../core/tools/Tools';
import { InputStateService } from '../input-state.service';

const BG_CHECKERBOARD_A = [32, 32, 32, 255];
const BG_CHECKERBOARD_B = [40, 40, 40, 255];

@Component({
  selector: 'app-doc-view',
  templateUrl: './doc-view.component.html',
  styleUrls: ['./doc-view.component.css']
})
export class DocViewComponent implements DoCheck {
  @Input() app: App;
  @Input() doc: Doc;

  @ViewChild('canvas') canvas: ElementRef;
  @ViewChild('artboard') artboard: ElementRef;

  constructor(public inputState: InputStateService) { }

  ngDoCheck() {
    if (this.doc.needsUpdate) {
      this.updateCanvas();
      this.doc.needsUpdate = false;
    }
  }

  buildMouseEventContext(e): ToolContext {
    let pos = this.mousePositionInCanvasSpace(e);
    let posInElement = this.mousePositionInScreenSpaceOnArtboard(e);
    return {
      app: this.app,
      doc: this.doc,
      pos: pos,
      posInElement: posInElement
    };
  }

  mousedown(e) {
    this.inputState.takeIfFree(this);

    if (this.inputState.hasFocus(this)) {
      if (e.which === 2) {
        this.app.pushTool(this.app.pannerTool);
      }
      this.app.activeTool.onMouseDown(this.buildMouseEventContext(e));
      e.preventDefault();
      return false;
    }
  }

  @HostListener("window:mouseup", ["$event"])
  mouseup(e) {
    if (this.inputState.hasFocus(this)) {
      if (e.which === 2) {
        this.app.popTool();
      }
      this.app.activeTool.onMouseUp(this.buildMouseEventContext(e));
      e.preventDefault();
      this.inputState.releaseFocus(this);
      return false;
    }
  }

  @HostListener("window:mousemove", ["$event"])
  mousemove(e) {
    this.inputState.takeIfFree(this);
    if (this.inputState.hasFocus(this)) {
      this.app.activeTool.onMouseMove(this.buildMouseEventContext(e));
      e.preventDefault();
      return false;
    }
  }

  mousewheel(e) {
    var artboardMousePos = this.mousePositionInScreenSpaceOnArtboard(e);
    var newZoom = this.doc.zoom * Math.pow(2, 0.004 * this.app.preferences.scrollZoomSpeed * -e.deltaY);

    this.doc.rezoom(artboardMousePos, newZoom);
  }

  mousePositionInScreenSpaceOnArtboard(e) {
    var clientRect = this.artboard.nativeElement.getBoundingClientRect();
    return new Vec(e.pageX - clientRect.left, e.pageY - clientRect.top);
  }

  mousePositionInScreenSpaceRelativeToCanvasCorner(e) {
    var clientRect = this.canvas.nativeElement.getBoundingClientRect();
    return new Vec(e.pageX - clientRect.left, e.pageY - clientRect.top);
  }

  mousePositionInCanvasSpace(e) {
    return this.mousePositionInScreenSpaceRelativeToCanvasCorner(
      e
    ).scalarMult(1 / this.doc.zoom);
  }

  canvasStyle() {
    if (!this.doc) return;
    return {
      width: this.doc.width * this.doc.zoom + "px",
      height: this.doc.height * this.doc.zoom + "px",
      position: "absolute",
      top: this.doc.offset.y + "px",
      left: this.doc.offset.x + "px"
    };
  }

  artboardClasses() {
    return this.app.activeTool.getCssCursor();
  }

  updateCanvas() {
    var canvas = <HTMLCanvasElement>this.canvas.nativeElement;
    var ctx = canvas.getContext('2d');

    if (!this.doc) return;

    const doc = this.doc;
    canvas.width = this.doc.width;
    canvas.height = this.doc.height;
    const checkerboardSize = 8;

    if (doc.layers.length === 0) {
      return;
    } //TODO: clear screen instead

    var blitLayer = doc.createFinalBlit(); // todo actually composite here
    let idata = ctx.getImageData(0, 0, blitLayer.width, blitLayer.height);
    for (let y = 0; y < blitLayer.height; y++) {
      for (let x = 0; x < blitLayer.width; x++) {
        var i = x + y * blitLayer.width;
        var I = i * 4;

        var fAlpha = blitLayer.pixels[I + 3] / 255;
        var fAlphaOneMinus = 1 - fAlpha;

        var checkerboardState =
          (x % (checkerboardSize * 2) < checkerboardSize) !==
          (y % (checkerboardSize * 2) < checkerboardSize);
        var bgChecker = checkerboardState
          ? BG_CHECKERBOARD_A
          : BG_CHECKERBOARD_B;

        idata.data[I + 0] =
          blitLayer.pixels[I + 0] * fAlpha + bgChecker[0] * fAlphaOneMinus;
        idata.data[I + 1] =
          blitLayer.pixels[I + 1] * fAlpha + bgChecker[1] * fAlphaOneMinus;
        idata.data[I + 2] =
          blitLayer.pixels[I + 2] * fAlpha + bgChecker[2] * fAlphaOneMinus;
        idata.data[I + 3] = 255;
      }
    }
    ctx.putImageData(idata, 0, 0);
  }
}