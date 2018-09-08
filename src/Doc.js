import React from 'react';

export class Doc {
  constructor(width, height) {
    this.width = width;
    this.height = height;
    this.pixels = new Array(width * height * 4).fill(128);
  }
}

export class DocView extends React.Component {
  render() {
    return <div>
      Hi this is a document
      <canvas ref="canvas" width={this.props.doc.width} height={this.props.doc.height}></canvas>
    </div>
  }

  componentDidMount() {
    const doc = this.props.doc;
    const ctx = this.refs.canvas.getContext("2d")

    const img = new Image();
    img.src = "peepAvatar_neutral_0.png"; // TODO pull this out when i have more coherent plan for loading images
    img.onload = () => {
      // make a headless canvas to parse the png into pixels for us. this is not the canvas we draw the editor image to!
      let imageLoaderCanvas = document.createElement("canvas");
      imageLoaderCanvas.width = img.width;
      imageLoaderCanvas.height = img.height;
      let loaderCtx = imageLoaderCanvas.getContext('2d');
      loaderCtx.drawImage(img, 0, 0);
      let loaderData = loaderCtx.getImageData(0, 0, img.width, img.height);
      doc.pixels = loaderData.data;
      doc.width = img.width;
      doc.height = img.height;
      // end messy loading stuff to be moved elsewhere...

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
}
