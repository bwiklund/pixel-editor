<template>
  <div class="doc-view">
    <canvas ref="canvas" :style="canvasStyle()" />
  </div>
</template>

<script>

const BG_CHECKERBOARD_A = [32, 32, 32, 255];
const BG_CHECKERBOARD_B = [40, 40, 40, 255];

export default {
  name: "DocView",
  props: ["doc"],
  data() {
    return {
      zoom: 4
    }
  },
  methods: {
    canvasStyle() {
      return {
        width: (this.doc.width * this.zoom) + "px",
        height: (this.doc.height * this.zoom) + "px"
      }
    },
    updateCanvas() {
      console.log("Updating canvas");
      
      const doc = this.doc;
      var canvas = this.$refs.canvas;
      canvas.width = this.doc.width;
      canvas.height = this.doc.height;
      const ctx = canvas.getContext("2d")
      const checkerboardSize = 8;

      if (doc.layers.length === 0) { return; } //TODO: clear screen instead

      let idata = ctx.getImageData(0, 0, doc.width, doc.height);
      for (let y = 0; y < doc.height; y++) {
        for (let x = 0; x < doc.width; x++) {
          var i = x + y * doc.width;
          var I = i * 4;

          var blitLayer = doc.layers[0]; // todo actually composite here
          var fAlpha = blitLayer.pixels[I + 3] / 255;
          var fAlphaOneMinus = 1 - fAlpha;

          var checkerboardState = (x % (checkerboardSize * 2) < checkerboardSize) ^ (y % (checkerboardSize * 2) < checkerboardSize);
          var checkerboardForPixel = checkerboardState ? BG_CHECKERBOARD_A : BG_CHECKERBOARD_B;

          idata.data[I + 0] = blitLayer.pixels[I + 0] * fAlpha + checkerboardForPixel[0] * fAlphaOneMinus;
          idata.data[I + 1] = blitLayer.pixels[I + 1] * fAlpha + checkerboardForPixel[1] * fAlphaOneMinus;
          idata.data[I + 2] = blitLayer.pixels[I + 2] * fAlpha + checkerboardForPixel[2] * fAlphaOneMinus;
          idata.data[I + 3] = 255;// always falls back to checkerboard, so always actually filled no matter what
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
</style>
