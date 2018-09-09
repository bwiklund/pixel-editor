import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

import { Doc, DocHeader, DocView } from './Doc';
import { Tool, Pencil, Panner } from './Tools';
import { ColorPicker } from './ColorPicker';
import { Palette } from './Palette';

export default class AppView extends React.Component {
  pencilTool = new Pencil();
  pannerTool = new Panner();

  constructor(props) {
    super(props);
    this.state = {
      docs: [],
      activeDocIndex: 0,
      activeTool: this.pannerTool
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

  setActiveDoc(doc) {
    this.setState((st, pr) => {
      return {
        activeDocIndex: st.docs.indexOf(doc)
      }
    });
  }
  

  ////////////////////////////////////// start mouse boilerplate ///////////////////////////////////////////////
  onMouseDown(e) {
    var docView = this.refs.activeDocView;
    var doc = this.state.docs[this.state.activeDocIndex];
    let pos = docView.mousePositionInCanvasSpace(e);
    let posInElement = docView.mousePositionInScreenSpaceOnArtboard(e);
    this.state.activeTool.onMouseDown(pos, doc, {docView: docView, posInElement: posInElement});

    this.lastPosInElement = posInElement;
    docView.redraw();
  }

  onMouseMove(e) {
    var docView = this.refs.activeDocView;
    var doc = this.state.docs[this.state.activeDocIndex];
    let pos = docView.mousePositionInCanvasSpace(e);
    let posInElement = docView.mousePositionInScreenSpaceOnArtboard(e);
    this.state.activeTool.onMouseMove(pos, doc, {docView: docView, posInElement: posInElement});

    this.lastPosInElement = posInElement;
    docView.redraw();
  }

  onMouseUp(e) {
    var docView = this.refs.activeDocView;
    var doc = this.state.docs[this.state.activeDocIndex];
    let pos = docView.mousePositionInCanvasSpace(e);
    let posInElement = docView.mousePositionInScreenSpaceOnArtboard(e);
    this.state.activeTool.onMouseUp(pos, doc, {docView: docView, posInElement: posInElement});

    this.lastPosInElement = posInElement;
    docView.redraw();
  }
  ////////////////////////////////////// end mouse boilerplate ///////////////////////////////////////////////

  render() {
    let activeDoc = this.state.docs[this.state.activeDocIndex];
    let doc = activeDoc ? <DocView ref="activeDocView" key={activeDoc.guid} doc={activeDoc} /> : "";
    let docHeaders = this.state.docs.map((d) => <DocHeader key={d.guid} doc={d} onClick={() => this.setActiveDoc(d)} />);
    return <div
      className="top-container"
      onMouseDown={this.onMouseDown.bind(this)}
      onMouseMove={this.onMouseMove.bind(this)}
      onMouseUp={this.onMouseUp.bind(this)}>
      <header>{docHeaders}</header>
      <div className="main-container">
        <div className="sidebar">
          <ColorPicker />
          <Palette />
        </div>
        <main>
          <div>{doc}</div>
        </main>
      </div>
    </div>
  }
}


ReactDOM.render(<AppView />, document.getElementById('root'));