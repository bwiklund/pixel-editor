<template>
  <div class="doc-view">
    <div ref="artboard"  class="artboard" @mousedown="mousedown" @mouseup="mouseup" @mousemove="mousemove" @mousewheel="mousewheel">
      <canvas ref="canvas" :style="canvasStyle()" />
    </div>
    <Timeline :app="app" :doc="doc" />
  </div>
</template>

<script>
const BG_CHECKERBOARD_A = [32, 32, 32, 255];
const BG_CHECKERBOARD_B = [40, 40, 40, 255];

import { Vec } from "../models/Vec";
import Timeline from "./Timeline";

export default {
  name: "DocView",
  props: ["app", "doc"],
  components: { Timeline },
  data() {
    return {
      zoom: 4,
      offset: new Vec(50, 50)
    };
  },
  methods: {
    buildMouseEventContext(e) {
      let pos = this.mousePositionInCanvasSpace(e);
      let posInElement = this.mousePositionInScreenSpaceOnArtboard(e);
      return {
        app: this.app,
        doc: this.doc,
        docView: this,
        pos: pos,
        posInElement: posInElement,
        event: e
      };
    },

    mousedown(e) {
      if (e.which === 2) {
        this.app.pushTool(this.app.pannerTool);
        console.log(this.app.activeTool);
      }
      this.app.activeTool.onMouseDown(this.buildMouseEventContext(e));
      e.preventDefault();
      return false;
    },

    mouseup(e) {
      if (e.which === 2) {
        this.app.popTool();
      }
      this.app.activeTool.onMouseUp(this.buildMouseEventContext(e));
      e.preventDefault();
      return false;
    },

    mousemove(e) {
      this.app.activeTool.onMouseMove(this.buildMouseEventContext(e));
      e.preventDefault();
      return false;
    },

    mousewheel(e) {
      var artboardMousePos = this.mousePositionInScreenSpaceOnArtboard(e);
      var zoomCoef = Math.pow(2, 0.005 * -e.deltaY);
      var newZoom = this.zoom * zoomCoef;

      var topCornerFromMouseOffset = artboardMousePos.sub(this.offset);
      var newOffset = artboardMousePos.sub(
        topCornerFromMouseOffset.scalarMult(zoomCoef)
      );

      this.zoom = newZoom;
      this.offset = newOffset;

      console.log("ASDF");
    },

    mousePositionInScreenSpaceOnArtboard(e) {
      var clientRect = this.$refs.artboard.getBoundingClientRect();
      return new Vec(e.pageX - clientRect.left, e.pageY - clientRect.top);
    },

    mousePositionInScreenSpaceRelativeToCanvasCorner(e) {
      var clientRect = this.$refs.canvas.getBoundingClientRect();
      return new Vec(e.pageX - clientRect.left, e.pageY - clientRect.top);
    },

    mousePositionInCanvasSpace(e) {
      return this.mousePositionInScreenSpaceRelativeToCanvasCorner(
        e
      ).scalarMult(1 / this.zoom);
    },

    canvasStyle() {
      if (!this.doc) return;
      return {
        width: this.doc.width * this.zoom + "px",
        height: this.doc.height * this.zoom + "px",
        position: "absolute",
        top: this.offset.y + "px",
        left: this.offset.x + "px"
      };
    },
    updateCanvas() {
      console.log("Updating canvas");

      if (!this.doc) return;

      const doc = this.doc;
      var canvas = this.$refs.canvas;
      canvas.width = this.doc.width;
      canvas.height = this.doc.height;
      const ctx = canvas.getContext("2d");
      const checkerboardSize = 8;

      if (doc.layers.length === 0) {
        return;
      } //TODO: clear screen instead

      let idata = ctx.getImageData(0, 0, doc.width, doc.height);
      for (let y = 0; y < doc.height; y++) {
        for (let x = 0; x < doc.width; x++) {
          var i = x + y * doc.width;
          var I = i * 4;

          var blitLayer = doc.layers[0]; // todo actually composite here
          var fAlpha = blitLayer.pixels[I + 3] / 255;
          var fAlphaOneMinus = 1 - fAlpha;

          var checkerboardState =
            (x % (checkerboardSize * 2) < checkerboardSize) ^
            (y % (checkerboardSize * 2) < checkerboardSize);
          var bgChecker = checkerboardState
            ? BG_CHECKERBOARD_A
            : BG_CHECKERBOARD_B;

          idata.data[I + 0] =
            blitLayer.pixels[I + 0] * fAlpha + bgChecker[0] * fAlphaOneMinus;
          idata.data[I + 1] =
            blitLayer.pixels[I + 1] * fAlpha + bgChecker[1] * fAlphaOneMinus;
          idata.data[I + 2] =
            blitLayer.pixels[I + 2] * fAlpha + bgChecker[2] * fAlphaOneMinus;
          idata.data[I + 3] = 255;
        }
      }
      ctx.putImageData(idata, 0, 0);
    }
  },
  watch: {
    "doc.hash"() {
      this.updateCanvas();
    }
  },
  mounted() {
    var canvas = this.$refs.canvas;
    console.log(canvas);
  }
};
</script>

<style scoped>
canvas {
  image-rendering: optimizeSpeed;
  image-rendering: -moz-crisp-edges;
  image-rendering: -webkit-optimize-contrast;
  image-rendering: -o-crisp-edges;
  image-rendering: pixelated;
  -ms-interpolation-mode: nearest-neighbor;
}

.doc-view {
  display: flex;
  flex-direction: column;
  width: 100%;
}

.artboard {
  flex-grow: 1;
  position: relative;
  overflow: hidden;
}
</style>
