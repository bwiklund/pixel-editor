import React from 'react';
import { Tool, Pencil } from './Tools';
import Vec from './Vec';

const BG_CHECKERBOARD_A = [32, 32, 32, 255];
const BG_CHECKERBOARD_B = [40, 40, 40, 255];

export class Doc {
  constructor(name, width, height) {
    this.name = name;
    this.width = width;
    this.height = height;
    this.layers = [];
    this.activeLayerIndex = 0;
    this.guid = "" + Math.random();
  }

  get activeLayer() {
    return this.layers[this.activeLayerIndex];
  }
}

export class Layer {
  constructor(width, height) {
    this.width = width;
    this.height = height;
    this.pixels = new Array(this.width * this.height * 4).fill(0);
  }

  setPixel(v, r, g, b, a) {
    if (v.x < 0 || v.x >= this.width || v.y < 0 || v.y >= this.height) {
      return;
    }

    var i = ~~(v.x) + ~~(v.y) * this.width;
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
    if (dist == 0) { // avoid NaN
      this.setPixel(p1, r, g, b, a);
    } else {
      for (let n = 0; n <= dist; n += stepSize) {
        const p = p1.add(offset.scalarMult(n / dist));

        this.setPixel(p, r, g, b, a);
      }
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
      zoom: 4,
      offset: new Vec(50, 50) // absolute screen offset of the top left corner of the document
    }
  }

  render() {
    let doc = this.state.doc;

    const style = {
      width: doc.width * this.state.zoom,
      height: doc.height * this.state.zoom,
      position: "absolute",
      top: this.state.offset.y + "px",
      left: this.state.offset.x + "px",
    }; // TODO: use 3d transform to move canvas?

    // <div>{this.state.doc.name} | {this.state.doc.width}x{this.state.doc.height}px</div>

    return <div className="doc-view" ref="artboard" onWheel={this.onWheel.bind(this)}>
      <canvas
        ref="canvas"
        width={this.state.doc.width}
        height={this.state.doc.height}
        style={style}
      >
      </canvas>
    </div>
  }

  onWheel(e) {
    var artboardMousePos = this.mousePositionInScreenSpaceOnArtboard(e);
    var zoomCoef = Math.pow(2, 0.005 * -e.deltaY);
    var newZoom = this.state.zoom * zoomCoef;

    var topCornerFromMouseOffset = artboardMousePos.sub(this.state.offset);
    var newOffset = artboardMousePos.sub(topCornerFromMouseOffset.scalarMult(zoomCoef));

    this.setState({ zoom: newZoom, offset: newOffset });
  }

  mousePositionInScreenSpaceOnArtboard(e) {
    var clientRect = this.refs.artboard.getBoundingClientRect();
    return new Vec(e.pageX - clientRect.left, e.pageY - clientRect.top);
  }

  mousePositionInScreenSpaceRelativeToCanvasCorner(e) {
    var clientRect = this.refs.canvas.getBoundingClientRect();
    return new Vec(e.pageX - clientRect.left, e.pageY - clientRect.top);
  }

  mousePositionInCanvasSpace(e) {
    return this.mousePositionInScreenSpaceRelativeToCanvasCorner(e).scalarMult(1 / this.state.zoom);
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

    if (doc.layers.length == 0) { return; } //TODO: clear screen instead

    let idata = ctx.getImageData(0, 0, doc.width, doc.height);
    for (let y = 0; y < doc.height; y++) {
      for (let x = 0; x < doc.width; x++) {
        var i = x + y * doc.width;
        var I = i * 4;

        var blitLayer = doc.layers[0]; // todo actually composite here
        var fAlpha = blitLayer.pixels[I + 3] / 255;
        var fAlphaOneMinus = 1 - fAlpha;

        var checkerboardState = (x % (checkerboardSize * 2) < checkerboardSize) ^ (y % (checkerboardSize * 2) < checkerboardSize);
        var checkerboardForPixel = checkerboardState ? BG_CHECKERBOARD_A : BG_CHECKERBOARD_B;

        idata.data[I + 0] = blitLayer.pixels[I + 0] * fAlpha + checkerboardForPixel[0] * fAlphaOneMinus;
        idata.data[I + 1] = blitLayer.pixels[I + 1] * fAlpha + checkerboardForPixel[1] * fAlphaOneMinus;
        idata.data[I + 2] = blitLayer.pixels[I + 2] * fAlpha + checkerboardForPixel[2] * fAlphaOneMinus;
        idata.data[I + 3] = 255;// always falls back to checkerboard, so always actually filled no matter what
      }
    }
    ctx.putImageData(idata, 0, 0);
  }
}
