import { Component, OnInit, ViewChild, ElementRef, Input, DoCheck, HostListener } from '@angular/core';

import { App } from '../../core/App';
import { Vec } from '../../core/Vec';
import { Color } from '../../core/Color';
import { InputStateService } from '../input-state.service';

@Component({
  selector: 'app-color-picker',
  templateUrl: './color-picker.component.html',
  styleUrls: ['./color-picker.component.css']
})
export class ColorPickerComponent implements OnInit, DoCheck {
  @Input() app: App;
  @ViewChild("canvas") canvas: ElementRef;
  @ViewChild("hueBarCanvas") hueBarCanvas: ElementRef;

  isMouseDownHSV: boolean = false;
  isMouseDownHue: boolean = false;
  hsv = { h: 0, s: 1, v: 1 }

  constructor(public inputState: InputStateService) { }

  ngOnInit() {
    this.updateCanvas();
    this.updateHueBar();
  }

  // FIXME: make this only run on changes to the selected color
  ngDoCheck() {
    this.updateCanvas();
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
    var c = Color.fromHSV(this.hsv.h, pos.x / 255, 1 - pos.y / 255);
    // TODO: remember saturation when we hit true black so it doesn't snap to bottom left
    this.app.colorFg = c;
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
      var c = Color.fromHSV(pos.x / 255, this.hsv.s, this.hsv.v);
      this.app.colorFg = c;
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

  updateCanvas() {
    const canvas = this.canvas.nativeElement;
    canvas.width = 256;
    canvas.height = 256;
    var ctx = canvas.getContext("2d");

    this.hsv = this.app.colorFg.toHSV();

    let idata = ctx.getImageData(0, 0, canvas.width, canvas.height);
    for (let y = 0; y < canvas.height; y++) {
      for (let x = 0; x < canvas.width; x++) {
        var i = x + y * canvas.width;
        var I = i * 4;

        var c = Color.fromHSV(this.hsv.h, x / 255, 1 - y / 255);

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
    canvas.width = 256;
    canvas.height = 1;
    var ctx = canvas.getContext("2d");

    let idata = ctx.getImageData(0, 0, canvas.width, canvas.height);
    for (let y = 0; y < canvas.height; y++) {
      for (let x = 0; x < canvas.width; x++) {
        var i = x + y * canvas.width;
        var I = i * 4;

        var c = Color.fromHSV(x / 255, 1, 1);

        idata.data[I + 0] = c.r;
        idata.data[I + 1] = c.g;
        idata.data[I + 2] = c.b;
        idata.data[I + 3] = 255; // always falls back to checkerboard, so always actually filled no matter what
      }
    }
    ctx.putImageData(idata, 0, 0);
  }

}
