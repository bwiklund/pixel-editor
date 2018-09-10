import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

import { Doc } from './Doc';
import { Layer } from './Layer';
import { DocHeader, DocView } from './DocView';
import { Tool, Pencil, Panner } from './Tools';
import { ColorPicker } from './ColorPicker';
import { Palette, PaletteCell } from './Palette';
import { Color } from './Color';
import { newDocFromImage } from './ImageImporter';

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

  setActiveDoc(doc) {
    this.setState((st, pr) => {
      return {
        activeDocIndex: st.docs.indexOf(doc)
      }
    });
  }


  ////////////////////////////////////// start mouse boilerplate ///////////////////////////////////////////////
  // each mouse handler needs a bunch of information passed to the tool, here's where we build that.
  // if this wasn't all gathered here then a bunch of other methods would be terrible
  buildMouseEventContext(e) {
    var docView = this.refs.activeDocView;
    var doc = this.state.docs[this.state.activeDocIndex];
    let pos = docView.mousePositionInCanvasSpace(e);
    let posInElement = docView.mousePositionInScreenSpaceOnArtboard(e);
    return {
      doc: doc,
      appView: this,
      docView: docView,
      pos: pos,
      posInElement: posInElement,
      event: e,
    }
  }

  onMouseDown(e) {
    this.state.activeTool.onMouseDown(this.buildMouseEventContext(e));
    this.refs.activeDocView.redraw();
  }

  onMouseMove(e) {
    this.state.activeTool.onMouseMove(this.buildMouseEventContext(e));
    this.refs.activeDocView.redraw();
  }

  onMouseUp(e) {
    this.state.activeTool.onMouseUp(this.buildMouseEventContext(e));
    this.refs.activeDocView.redraw();
  }
  ////////////////////////////////////// end mouse boilerplate ///////////////////////////////////////////////

  onKeyDown(e) {
    if (e.repeat) { return; }
    if (e.keyCode === 32) { //space
      this.overriddenTool = this.state.activeTool;
      this.state.activeTool.interrupt();
      this.setState({ activeTool: this.pannerTool });
    }
    if (e.keyCode === 78) {// N
      this.state.docs[this.state.activeDocIndex].newLayer();
      this.forceUpdate();
    }
  }

  onKeyUp(e) {
    if (e.repeat) { return; }
    if (e.keyCode === 32) { //space
      this.state.activeTool.interrupt();
      this.setState({ activeTool: this.overriddenTool });
    }
    if (e.keyCode === 88) { // X
      let fg = this.state.colorFg;
      let bg = this.state.colorBg;
      this.setState({ colorFg: bg, colorBg: fg });
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

  newDocFromImage(path) {
    this.state.docs.push(newDocFromImage(path, () => this.forceUpdate()));
    this.forceUpdate();
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
          {doc}
        </main>
      </div>
    </div>
  }
}


ReactDOM.render(<AppView />, document.getElementById('root'));