import React from 'react';

export class Palette extends React.Component {
  render() {
    let colors = ["#333333", "#ffffff", "#000000", "#333333", "#ffffff", "#000000", "#333333", "#ffffff", "#000000", "#333333", "#ffffff", "#000000"];
    let cells = colors.map((c, i) => <PaletteCell key={i} color={c} />);
    return <div className="palette">{cells}</div>
  }
}

function PaletteCell(props) {
  return <div className="palette-cell" style={{background: props.color}}></div>
}