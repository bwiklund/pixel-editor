import { Component, OnInit, ViewChild, ElementRef, Input, DoCheck, HostListener, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';

import { Vec, Color, HSV } from '../../core/core';
import { InputStateService } from '../input-state.service';

@Component({
  selector: 'app-color-picker',
  templateUrl: './color-picker.component.html',
  styleUrls: ['./color-picker.component.css']
})
export class ColorPickerComponent implements OnInit, OnChanges {
  colorValue: Color;
  @Output()
  colorChange = new EventEmitter<Color>();
  @Input()
  get color() { return this.colorValue; }
  set color(val) { this.colorValue = val; this.colorChange.emit(this.colorValue) }

  // out internal HSV representation that we track to avoid issues described below
  private hsv: HSV = null;

  @ViewChild("canvas") canvas: ElementRef;
  @ViewChild("hueBarCanvas") hueBarCanvas: ElementRef;

  isMouseDownHSV: boolean = false;
  isMouseDownHue: boolean = false;

  constructor(public inputState: InputStateService) { }

  ngOnInit() {
    this.updateCanvas();
    this.updateHueBar();
  }

  ngOnChanges(change: SimpleChanges) {
    var lastHsv = this.hsv;

    this.hsv = this.hsv || this.color.toHSV(); // first time

    // only change our internal HSV representation if we need to,
    // otherwise we're feeding rounded RGBA values back into the input
    // and losing hue position on full black, and getting all
    // kinds of accumulated errors as you mix colors
    if (!this.hsv.toRGB().equalTo(this.color)) {
      this.hsv = this.color.toHSV();
    }

    if (!lastHsv || (this.hsv.h != lastHsv.h)) {
      this.updateCanvas();
    }
  }

  mousedownSatVal(e) {
    this.inputState.takeFocus(this);
    this.isMouseDownHSV = true;
    this.mousemove(e);
  }

  @HostListener("window:mousemove", ['$event'])
  mousemove(e) {
    if (this.inputState.hasFocus(this)) {
      if (this.isMouseDownHSV) {
        this.mousemoveSatVal(e);
      }
      if (this.isMouseDownHue) {
        this.mousemoveHueBar(e);
      }
    }
  }

  @HostListener("window:mouseup", ['$event'])
  mouseup(e) {
    if (this.inputState.hasFocus(this)) {
      if (this.isMouseDownHSV) {
        this.isMouseDownHSV = false;
      }
      if (this.isMouseDownHue) {
        this.isMouseDownHue = false;
      }
      this.inputState.releaseFocus(this);
    }
  }

  mousemoveSatVal(e) {
    var clientRect = this.canvas.nativeElement.getBoundingClientRect();
    var pos = new Vec(e.pageX - clientRect.left, e.pageY - clientRect.top);
    pos.x = Math.max(0, Math.min(255, pos.x));
    pos.y = Math.max(0, Math.min(255, pos.y));
    this.hsv = new HSV(this.hsv.h, pos.x / 255, 1 - pos.y / 255);
    this.color = this.hsv.toRGB();
  }

  mousedownHueBar(e) {
    this.inputState.takeFocus(this);
    this.isMouseDownHue = true;
    this.mousemoveHueBar(e);
  }

  mousemoveHueBar(e) {
    if (this.isMouseDownHue && this.inputState.hasFocus(this)) {
      var clientRect = this.canvas.nativeElement.getBoundingClientRect();
      var pos = new Vec(e.pageX - clientRect.left, e.pageY - clientRect.top);
      pos.x = Math.max(0, Math.min(255, pos.x));
      this.hsv = new HSV(pos.x / 255, this.hsv.s, this.hsv.v);
      this.color = this.hsv.toRGB();
      this.updateCanvas(); // moving this bar kind of always means we're changing hue by definition, so,
    }
  }

  mouseupHueBar(e) {
    this.isMouseDownHue = false;
  }

  reticlePostion() {
    return {
      left: this.hsv.s * 255 + "px",
      top: (1 - this.hsv.v) * 255 + "px",
    }
  }

  hueReticlePostion() {
    return {
      left: this.hsv.h * 255 + "px"
    }
  }

  updateCanvas() {
    const canvas = this.canvas.nativeElement;
    // this can be 256 to be perfectionist but we can make it smaller and upscale with no real downside
    // the colors aren't picked from this and the difference in pixel values is way below human perception at 64x64
    var size = 64; 
    canvas.width = size;
    canvas.height = size;
    var ctx = canvas.getContext("2d");

    let idata = ctx.getImageData(0, 0, canvas.width, canvas.height);
    for (let y = 0; y < canvas.height; y++) {
      for (let x = 0; x < canvas.width; x++) {
        var i = x + y * canvas.width;
        var I = i * 4;

        var c = new HSV(this.hsv.h, x / (size - 1), 1 - y / (size - 1)).toRGB();

        idata.data[I + 0] = c.r;
        idata.data[I + 1] = c.g;
        idata.data[I + 2] = c.b;
        idata.data[I + 3] = 255; // always falls back to checkerboard, so always actually filled no matter what
      }
    }
    ctx.putImageData(idata, 0, 0);
  }

  updateHueBar() {
    const canvas = this.hueBarCanvas.nativeElement;
    var size = 256; // this we should keep high because hue changes rapidly and it's extremely tiny anyways
    canvas.width = size;
    canvas.height = 1;
    var ctx = canvas.getContext("2d");

    let idata = ctx.getImageData(0, 0, canvas.width, canvas.height);
    for (let y = 0; y < canvas.height; y++) {
      for (let x = 0; x < canvas.width; x++) {
        var i = x + y * canvas.width;
        var I = i * 4;

        var c = new HSV(x / size, 1, 1).toRGB();

        idata.data[I + 0] = c.r;
        idata.data[I + 1] = c.g;
        idata.data[I + 2] = c.b;
        idata.data[I + 3] = 255; // always falls back to checkerboard, so always actually filled no matter what
      }
    }
    ctx.putImageData(idata, 0, 0);
  }

}
