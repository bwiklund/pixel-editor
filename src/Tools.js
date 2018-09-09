export class Tool {
  onMouseDown(pos, doc) {

  }

  onMouseMove(pos, doc) {

  }

  onMouseUp(pos, doc) {

  }
}

export class Pencil extends Tool {
  mouseIsDown = false;
  lastPos = null;

  onEnable() {

  }

  drawPencilStrokes(pos, doc) {
    if (this.mouseIsDown) {
      console.log(pos);
      if (!this.lastPos) {
        doc.setPixel(pos, 255, 255, 255, 255);
      } else {
        doc.drawLine(pos, this.lastPos, 255, 255, 255, 255);
      }
      this.lastPos = pos.copy();
    }
  }

  onMouseDown(pos, doc) {
    this.mouseIsDown = true;
    this.drawPencilStrokes(pos, doc);
    // if (e.shiftKey) { // test dragging
    //   var diff = posInElement.sub(this.lastPosInElement);
    //   this.setState({offset: this.state.offset.add(diff)});
    // }
  }

  onMouseMove(pos, doc) {
    this.drawPencilStrokes(pos, doc);
  }

  onMouseUp(pos, doc) {
    this.mouseIsDown = false;
    this.drawPencilStrokes(pos, doc);
    this.lastPos = null;
  }
}