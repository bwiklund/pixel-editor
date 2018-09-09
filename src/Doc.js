import React from 'react';

import Vec from './Vec';

const BG_CHECKERBOARD_A = [32, 32, 32, 255];
const BG_CHECKERBOARD_B = [40, 40, 40, 255];

export class Doc {
  constructor(name, width, height) {
    this.name = name;
    this.width = width;
    this.height = height;
    this.pixels = new Array(width * height * 4).fill(128);

    this.guid = "" + Math.random();
  }

  setPixel(v, r, g, b, a) {
    if (v.x < 0 || v.x > this.width - 1 || v.y < 0 || v.y > this.height - 1) {
      return;
    }

    var i = ~~v.x + ~~v.y * this.width;
    var I = i * 4;
    this.pixels[I + 0] = r;
    this.pixels[I + 1] = g;
    this.pixels[I + 2] = b;
    this.pixels[I + 3] = a;
  }

  drawLine(p1, p2, r, g, b, a) {
    // TODO: move this to a pencil tool class
    // first pass, just move <= 1 pixel at a time in the right direction.
    // this could be more efficient if i cared
    const offset = p2.sub(p1);
    const dist = offset.mag();
    const stepSize = 0.1;
    for (let n = 0; n <= dist; n += stepSize) {
      const p = p1.add(offset.scalarMult(n / dist));

      this.setPixel(p, r, g, b, a);
    }
  }
}

export class DocHeader extends React.Component {
  render() {
    return <div className="doc-header" onClick={() => this.props.onClick()}>{this.props.doc.name}</div>
  }
}

export class DocView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      doc: props.doc,
      zoom: 4
    }
  }

  render() {
    let doc = this.state.doc;

    const style = {
      width: doc.width * this.state.zoom,
      height: doc.height * this.state.zoom
    };

    // <div>{this.state.doc.name} | {this.state.doc.width}x{this.state.doc.height}px</div>

    return <div className="doc-view">
      <canvas
        ref="canvas"
        width={this.state.doc.width}
        height={this.state.doc.height}
        style={style}
        onMouseDown={this.onMouseDown.bind(this)}
        onMouseMove={this.onMouseDown.bind(this)}
        onMouseUp={this.onMouseDown.bind(this)}
      >
      </canvas>
    </div>
  }

  onMouseDown(e) {
    let pos = new Vec(
      (e.pageX - this.refs.canvas.offsetLeft) / this.state.zoom,
      (e.pageY - this.refs.canvas.offsetTop) / this.state.zoom
    );

    var doc = this.state.doc;

    // TODO: lastpos is a janky test of line drawing, move this plz
    if (!this.lastPos) {
      doc.setPixel(pos, 0, 0, 0, 255);
    } else {
      doc.drawLine(pos, this.lastPos, 0, 0, 0, 255);
    }
    this.lastPos = pos;

    this.redraw();
  }

  componentDidMount() {
    this.redraw();
  }

  componentDidUpdate() {
    this.redraw();
  }

  redraw() {
    const doc = this.state.doc;
    const ctx = this.refs.canvas.getContext("2d")
    const checkerboardSize = 8;

    let idata = ctx.getImageData(0, 0, doc.width, doc.height);
    for (let y = 0; y < doc.height; y++) {
      for (let x = 0; x < doc.width; x++) {
        var i = x + y * doc.width;
        var I = i * 4;

        var fAlpha = doc.pixels[I + 3] / 255;
        var fAlphaOneMinus = 1 - fAlpha;

        var checkerboardState = (x % (checkerboardSize * 2) < checkerboardSize) ^ (y % (checkerboardSize * 2) < checkerboardSize);
        var checkerboardForPixel = checkerboardState ? BG_CHECKERBOARD_A : BG_CHECKERBOARD_B;

        idata.data[I + 0] = doc.pixels[I + 0] * fAlpha + checkerboardForPixel[0] * fAlphaOneMinus;
        idata.data[I + 1] = doc.pixels[I + 1] * fAlpha + checkerboardForPixel[1] * fAlphaOneMinus;
        idata.data[I + 2] = doc.pixels[I + 2] * fAlpha + checkerboardForPixel[2] * fAlphaOneMinus;
        idata.data[I + 3] = 255;// always falls back to checkerboard, so always actually filled no matter what
      }
    }
    ctx.putImageData(idata, 0, 0);
  }
}
