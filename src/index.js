import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

import { Doc, DocView } from './Doc';

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      docs: []
    };
  }

  componentDidMount() {
    this.newDocFromImage("peepAvatar_neutral_0.png");
    this.newDocFromImage("lunaAvatar_neutral_0.png");
  }

  newDocFromImage(path) {
    let doc = new Doc(path, 1, 1);
    this.setState((state, props) => {
      return { docs: state.docs.concat(doc) }
    });
  
    const img = new Image();
    img.src = path; // TODO pull this out when i have more coherent plan for loading images
    img.onload = () => {
      // make a headless canvas to parse the png into pixels for us. this is not the canvas we draw the editor image to!
      let imageLoaderCanvas = document.createElement("canvas");
      imageLoaderCanvas.width = img.width;
      imageLoaderCanvas.height = img.height;
      let loaderCtx = imageLoaderCanvas.getContext('2d');
      loaderCtx.drawImage(img, 0, 0);
      let loaderData = loaderCtx.getImageData(0, 0, img.width, img.height);

      doc.pixels = loaderData.data;
      doc.height = img.height;
      doc.width = img.width;

      this.forceUpdate(); // is there a better way to force a redraw here?
    }
  }

  render() {
    var docs = this.state.docs.map((d) => <DocView key={d.guid} doc={d} />);
    return <div>{docs}</div>
  }
}


ReactDOM.render(<App />, document.getElementById('root'));