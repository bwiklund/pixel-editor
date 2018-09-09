import React from 'react';

export class ColorPicker extends React.Component {
  render() {
    return <div className="color-picker">
      <canvas ref="canvas" width="256" height="256" />
    </div>
  }

  componentDidMount() {
    const canvas = this.refs.canvas;
    var ctx = canvas.getContext('2d');

    let idata = ctx.getImageData(0, 0, canvas.width, canvas.height);
    for (let y = 0; y < canvas.height; y++) {
      for (let x = 0; x < canvas.width; x++) {
        var i = x + y * canvas.width;
        var I = i * 4;

        idata.data[I + 0] = 255-y;
        idata.data[I + 1] = 255-x;
        idata.data[I + 2] = 255;
        idata.data[I + 3] = 255;// always falls back to checkerboard, so always actually filled no matter what
      }
    }
    ctx.putImageData(idata, 0, 0);
  }
}