// all tools take mousePos, the document, and then `context`, which is a bucket of cruft that some tools will need access to

export class Tool {
  onMouseDown(pos, doc, context) {

  }

  onMouseMove(pos, doc, context) {

  }

  onMouseUp(pos, doc, context) {

  }

  interrupt() { } // when stuff cuts off the tool mid-action and it needs to reset itself and clean up
}

export class Pencil extends Tool {
  mouseIsDown = false;
  lastPos = null;
  
  interrupt() {
    this.mouseIsDown = false;
    this.lastPos = null;
  }

  drawPencilStrokes(pos, doc, context) {
    if (this.mouseIsDown) {
      if (!this.lastPos) {
        doc.setPixel(pos, 255, 255, 255, 255);
      } else {
        doc.drawLine(pos, this.lastPos, 255, 255, 255, 255);
      }
      this.lastPos = pos.copy();
    }
  }

  onMouseDown(pos, doc, context) {
    this.mouseIsDown = true;
    this.drawPencilStrokes(pos, doc, context);
  }

  onMouseMove(pos, doc, context) {
    this.drawPencilStrokes(pos, doc, context);
  }

  onMouseUp(pos, doc, context) {
    this.mouseIsDown = false;
    this.drawPencilStrokes(pos, doc, context);
    this.lastPos = null;
  }
}

export class Panner {
  mouseIsDown = false;
  lastPos = null;
  
  interrupt() {
    this.mouseIsDown = false;
    this.lastPos = null;
  }

  doPanning(pos, doc, context) {
    if (this.mouseIsDown) {
      if (this.lastPos) {
        var diff = context.posInElement.sub(this.lastPos);
        context.docView.setState({ offset: context.docView.state.offset.add(diff) });
      }
      this.lastPos = context.posInElement.copy();
    }
  }

  onMouseDown(pos, doc, context) {
    this.mouseIsDown = true;
    this.doPanning(pos, doc, context);
  }

  onMouseMove(pos, doc, context) {
    this.doPanning(pos, doc, context);
  }

  onMouseUp(pos, doc, context) {
    this.mouseIsDown = false;
    this.doPanning(pos, doc, context);
    this.lastPos = null;
  }
}