import React from 'react';

export class Doc {
  constructor(width, height) {
    this.width = width;
    this.height = height;
    this.pixels = new Array(width * height * 4).fill(128);
  }
}

export class DocView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      zoom: 4
    }
  }

  render() {
    let doc = this.props.doc;

    const style = {
      width: doc.width * this.state.zoom,
      height: doc.height * this.state.zoom
    };

    return <div>
      <canvas
        ref="canvas"
        width={doc.width}
        height={doc.height}
        style={style}
        onMouseDown={this.onMouseDown.bind(this)}
        onMouseMove={this.onMouseDown.bind(this)}
        onMouseUp={this.onMouseDown.bind(this)}
      >
      </canvas>
    </div>
  }

  onMouseDown(e) {
    let fx = (e.pageX - this.refs.canvas.offsetLeft) / this.state.zoom;
    let fy = (e.pageY - this.refs.canvas.offsetTop) / this.state.zoom;

    var x = Math.floor(fx);
    var y = Math.floor(fy);

    var doc = this.props.doc;
    var i = x + y * doc.width;
    var I = i * 4;
    doc.pixels[I+0] = 0;
    doc.pixels[I+1] = 0;
    doc.pixels[I+2] = 0;
    doc.pixels[I+3] = 255;

    this.redraw();
  }

  componentDidMount() {
    this.redraw();
  }

  redraw() {
    const doc = this.props.doc;
    const ctx = this.refs.canvas.getContext("2d")

    let idata = ctx.getImageData(0, 0, doc.width, doc.height);
    for (let y = 0; y < doc.height; y++) {
      for (let x = 0; x < doc.width; x++) {
        var i = x + y * doc.width;
        var I = i * 4;
        idata.data[I + 0] = doc.pixels[I + 0];
        idata.data[I + 1] = doc.pixels[I + 1];
        idata.data[I + 2] = doc.pixels[I + 2];
        idata.data[I + 3] = doc.pixels[I + 3];
      }
    }
    ctx.putImageData(idata, 0, 0);
  }
}
