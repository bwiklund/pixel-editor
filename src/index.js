import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

import { Doc, Layer, DocHeader, DocView } from './Doc';
import { Tool, Pencil, Panner } from './Tools';
import { ColorPicker } from './ColorPicker';
import { Palette, PaletteCell } from './Palette';
import { Color } from './Color';

export default class AppView extends React.Component {
  pencilTool = new Pencil();
  pannerTool = new Panner();
  overriddenTool = null; //used to store whatever tool was open before we held down, say, space to pan

  constructor(props) {
    super(props);
    this.state = {
      docs: [],
      activeDocIndex: 0,
      activeTool: this.pencilTool,
      colorFg: Color.fromHex("#e75952"),
      colorBg: Color.fromHex("#f9938a"),
    };
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

      doc.height = img.height;
      doc.width = img.width;
      var layer = new Layer(img.width, img.height);
      layer.pixels = loaderData.data;
      doc.layers[0] = layer;

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
    this.state.activeTool.onMouseDown(pos, doc, { appView: this, docView: docView, posInElement: posInElement });

    this.lastPosInElement = posInElement;
    docView.redraw();
  }

  onMouseMove(e) {
    var docView = this.refs.activeDocView;
    var doc = this.state.docs[this.state.activeDocIndex];
    let pos = docView.mousePositionInCanvasSpace(e);
    let posInElement = docView.mousePositionInScreenSpaceOnArtboard(e);
    this.state.activeTool.onMouseMove(pos, doc, { appView: this, docView: docView, posInElement: posInElement });

    this.lastPosInElement = posInElement;
    docView.redraw();
  }

  onMouseUp(e) {
    var docView = this.refs.activeDocView;
    var doc = this.state.docs[this.state.activeDocIndex];
    let pos = docView.mousePositionInCanvasSpace(e);
    let posInElement = docView.mousePositionInScreenSpaceOnArtboard(e);
    this.state.activeTool.onMouseUp(pos, doc, { appView: this, docView: docView, posInElement: posInElement });

    this.lastPosInElement = posInElement;
    docView.redraw();
  }
  ////////////////////////////////////// end mouse boilerplate ///////////////////////////////////////////////

  onKeyDown(e) {
    if (e.repeat) { return; }
    if (e.keyCode == 32) { //space
      this.overriddenTool = this.state.activeTool;
      this.state.activeTool.interrupt();
      this.setState({ activeTool: this.pannerTool });
    }
  }

  onKeyUp(e) {
    if (e.repeat) { return; }
    if (e.keyCode == 32) { //space
      this.state.activeTool.interrupt();
      this.setState({ activeTool: this.overriddenTool });
    }
    if (e.keyCode == 88) { // X
      let fg = this.state.colorFg;
      let bg = this.state.colorBg;
      this.setState({colorFg: bg, colorBg: fg});
    }
  }

  componentDidMount() {
    this.onKeyDown = this.onKeyDown.bind(this);
    this.onKeyUp = this.onKeyUp.bind(this);

    document.addEventListener("keydown", this.onKeyDown);
    document.addEventListener("keyup", this.onKeyUp);

    this.newDocFromImage("peepAvatar_neutral_0.png");
    this.newDocFromImage("lunaAvatar_neutral_0.png");
  }

  componentWillUnmount() {
    document.removeEventListener("keydown", this.onKeyDown);
    document.removeEventListener("keyup", this.onKeyUp);
  }

  render() {
    let activeDoc = this.state.docs[this.state.activeDocIndex];
    let doc = activeDoc ? <DocView ref="activeDocView" key={activeDoc.guid} doc={activeDoc} /> : "";
    let docHeaders = this.state.docs.map((d) => <DocHeader key={d.guid} doc={d} onClick={() => this.setActiveDoc(d)} />);
    return <div
      className="top-container"
      onMouseDown={this.onMouseDown.bind(this)}
      onMouseMove={this.onMouseMove.bind(this)}
      onMouseUp={this.onMouseUp.bind(this)}
    >
      <header>{docHeaders}</header>
      <div className="main-container">
        <div className="sidebar">
          <ColorPicker />
          <Palette setColor={(color) => this.setState({ colorFg: color })} />
          <div className="current-colors">
            <PaletteCell onMouseDown={() => { }} color={this.state.colorFg} />
            <PaletteCell onMouseDown={() => { }} color={this.state.colorBg} />
          </div>
        </div>
        <main>
          <div>{doc}</div>
        </main>
      </div>
    </div>
  }
}


ReactDOM.render(<AppView />, document.getElementById('root'));