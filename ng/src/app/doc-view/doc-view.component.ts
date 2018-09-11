import { Component, OnInit, ViewChild, ElementRef, Input, ChangeDetectorRef, OnChanges, DoCheck } from '@angular/core';
import { Doc } from '../../models/Doc';
import { Vec } from '../../models/Vec';

const BG_CHECKERBOARD_A = [32, 32, 32, 255];
const BG_CHECKERBOARD_B = [40, 40, 40, 255];

@Component({
  selector: 'app-doc-view',
  templateUrl: './doc-view.component.html',
  styleUrls: ['./doc-view.component.css']
})
export class DocViewComponent implements OnInit, DoCheck {
  @Input() doc: Doc;

  @ViewChild('canvas') canvas: ElementRef;

  offset: Vec = new Vec(50, 50);
  zoom: number = 4;

  constructor() { }

  ngOnInit() {
  }

  // todo: i can't get this to run on changes yet? fix this
  ngDoCheck() {
    console.log("docheck: " + this.doc.hash);
    this.updateCanvas();
  }

  canvasStyle() {
    if (!this.doc) return;
    return {
      width: this.doc.width * this.zoom + "px",
      height: this.doc.height * this.zoom + "px",
      position: "absolute",
      top: this.offset.y + "px",
      left: this.offset.x + "px"
    };
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