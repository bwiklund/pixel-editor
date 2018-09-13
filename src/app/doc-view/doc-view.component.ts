import { Component, OnInit, ViewChild, ElementRef, Input, ChangeDetectorRef, OnChanges, DoCheck } from '@angular/core';
import { App } from '../../core/App';
import { Doc } from '../../core/Doc';
import { Vec } from '../../core/Vec';
import { ToolContext } from '../../core/tools/Tools';

const BG_CHECKERBOARD_A = [32, 32, 32, 255];
const BG_CHECKERBOARD_B = [40, 40, 40, 255];

@Component({
  selector: 'app-doc-view',
  templateUrl: './doc-view.component.html',
  styleUrls: ['./doc-view.component.css']
})
export class DocViewComponent implements OnInit, DoCheck {
  @Input() app: App;
  @Input() doc: Doc;

  @ViewChild('canvas') canvas: ElementRef;
  @ViewChild('artboard') artboard: ElementRef;

  constructor() { }

  ngOnInit() {
  }

  // FIXME: only run this on changes to the doc hash
  ngDoCheck() {
    //console.log("docheck: " + this.doc.hash);
    this.updateCanvas();
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
    if (e.which === 2) {
      this.app.pushTool(this.app.pannerTool);
    }
    this.app.activeTool.onMouseDown(this.buildMouseEventContext(e));
    e.preventDefault();
    return false;
  }

  mouseup(e) {
    if (e.which === 2) {
      this.app.popTool();
    }
    this.app.activeTool.onMouseUp(this.buildMouseEventContext(e));
    e.preventDefault();
    return false;
  }

  mousemove(e) {
    this.app.activeTool.onMouseMove(this.buildMouseEventContext(e));
    e.preventDefault();
    return false;
  }

  mousewheel(e) {
    var artboardMousePos = this.mousePositionInScreenSpaceOnArtboard(e);
    var zoomCoef = Math.pow(2, 0.004 * this.app.preferences.scrollZoomSpeed * -e.deltaY);
    var newZoom = this.doc.zoom * zoomCoef;

    var topCornerFromMouseOffset = artboardMousePos.sub(this.doc.offset);
    var newOffset = artboardMousePos.sub(
      topCornerFromMouseOffset.scalarMult(zoomCoef)
    );

    this.doc.zoom = newZoom;
    this.doc.offset = newOffset;
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

    let idata = ctx.getImageData(0, 0, doc.width, doc.height);
    for (let y = 0; y < doc.height; y++) {
      for (let x = 0; x < doc.width; x++) {
        var i = x + y * doc.width;
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