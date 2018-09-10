<template>
  <div class="color-picker">
    <canvas ref="canvas" />
    <div class="big-color" :style="{background: app.colorFg.toHex()}" />
    <div class="big-color" :style="{background: app.colorBg.toHex()}" />
  </div>
</template>

<script>
export default {
  name: "colorpicker",
  props: ["app"],
  methods: {
    updateCanvas() {
      const canvas = this.$refs.canvas;
      canvas.width = 256;
      canvas.height = 256;
      var ctx = canvas.getContext("2d");

      let idata = ctx.getImageData(0, 0, canvas.width, canvas.height);
      for (let y = 0; y < canvas.height; y++) {
        for (let x = 0; x < canvas.width; x++) {
          var i = x + y * canvas.width;
          var I = i * 4;

          idata.data[I + 0] = 255 - y;
          idata.data[I + 1] = 255 - x;
          idata.data[I + 2] = 255;
          idata.data[I + 3] = 255; // always falls back to checkerboard, so always actually filled no matter what
        }
      }
      ctx.putImageData(idata, 0, 0);
    }
  },

  mounted() {
    this.updateCanvas();
  }
};
</script>

<style scoped>
.color-picker {
  margin: 4px;
}

.color-picker canvas {
  vertical-align: top;
}

.big-color {
  width: 100%;
  height: 32px;
  display: inline-block;
  vertical-align:top;
  margin: 4px 0 0 0;
}
</style>