import { Component, OnInit, ViewChild, ElementRef, Input } from '@angular/core';

import { App } from '../../models/App';
import { Color } from '../../models/Color';

@Component({
  selector: 'app-color-picker',
  templateUrl: './color-picker.component.html',
  styleUrls: ['./color-picker.component.css']
})
export class ColorPickerComponent implements OnInit {
  @Input() app: App;
  @ViewChild("canvas") canvas: ElementRef;
  @ViewChild("hueBarCanvas") hueBarCanvas: ElementRef;

  isMouseDownHSV: boolean = false;
  isMouseDownHue: boolean = false;
  hsv = {h: 0, s: 1, v: 1}

  constructor() { }

  ngOnInit() {
    this.updateCanvas();
    this.updateHueBar();
  }

  mousedown(e) {
    this.isMouseDownHSV = true;
    this.mousemove(e);
  }

  mousemove(e) {
    if (this.isMouseDownHSV) {
      var clientRect = this.canvas.nativeElement.getBoundingClientRect();
      var pos = new Vec(e.pageX - clientRect.left, e.pageY - clientRect.top);
      var c = Color.fromHSV(this.hsv.h, pos.x / 255, 1 - pos.y / 255);
      this.app.colorFg = c;
    }
  }

  mouseup(e) {
    this.isMouseDownHSV = false;
  }


  mousedownHueBar(e) {
    this.isMouseDownHue = true;
    this.mousemoveHueBar(e);
  }

  mousemoveHueBar(e) {
    if (this.isMouseDownHue) {
      var clientRect = this.canvas.nativeElement.getBoundingClientRect();
      var pos = new Vec(e.pageX - clientRect.left, e.pageY - clientRect.top);
      var c = Color.fromHSV(pos.x / 255, this.hsv.s, this.hsv.v);
      this.app.colorFg = c;
    }
  }

  mouseupHueBar(e) {
    this.isMouseDownHue = false;
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
