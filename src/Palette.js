import React from 'react';
import { Color } from './Color';

// swiped from https://lospec.com/palette-list/enos16
const txtPaletteTest = ["#fafafa","#d4d4d4","#9d9d9d","#4b4b4b","#f9d381","#eaaf4d","#f9938a","#e75952","#9ad1f9","#58aeee","#8deda7","#44c55b","#c3a7e1","#9569c8","#bab5aa","#948e82"];

export class Palette extends React.Component {
  render() {
    // TODO: actually store these in the document and not just inline here for prototyping
    let colors = txtPaletteTest.map((h) => Color.fromHex(h));
    let cells = colors.map((c, i) => <PaletteCell onMouseDown={(color) => this.props.setColor(color)} key={i} color={c} />);
    return <div className="palette">{cells}</div>
  }
}

export function PaletteCell(props) {
  return <div
    className="palette-cell"
    style={{ background: props.color.toHex() }}
    onMouseDown={() => props.onMouseDown(props.color)}
  ></div>
}