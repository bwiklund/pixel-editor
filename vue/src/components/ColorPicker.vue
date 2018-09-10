<template>
  <div class="color-picker">
    <canvas ref="canvas" @mousedown="mousedown" @mousemove="mousemove" @mouseup="mouseup"/>
    <canvas ref="hueBar" class="hue-bar" @mousedown="mousedownHueBar" @mousemove="mousemoveHueBar" @mouseup="mouseupHueBar"/>
    <div class="big-color" :style="{background: app.colorFg.toHex()}" />
    <div class="big-color" :style="{background: app.colorBg.toHex()}" />
  </div>
</template>

<script>
import { Vec } from "../models/Vec";
import { Color } from "../models/Color";

export default {
  name: "colorpicker",
  props: ["app"],
  data() {
    return {
      hsv: {
        h: 0,
        s: 1,
        v: 0.5
      },
      isMouseDownHSV: false,
      isMouseDownHue: false
    };
  },
  methods: {
    mousedown(e) {
      this.isMouseDownHSV = true;
      this.mousemove(e);
    },
    mousemove(e) {
      if (this.isMouseDownHSV) {
        var clientRect = this.$refs.canvas.getBoundingClientRect();
        var pos = new Vec(e.pageX - clientRect.left, e.pageY - clientRect.top);
        var c = Color.fromHSV(this.hsv.h, pos.x / 255, pos.y / 255);
        this.app.colorFg = c;
      }
    },
    mouseup(e) {
      this.isMouseDownHSV = false;
    },

    mousedownHueBar(e) {
      this.isMouseDownHue = true;
      this.mousemoveHueBar(e);
    },
    mousemoveHueBar(e) {
      if (this.isMouseDownHue) {
        var clientRect = this.$refs.canvas.getBoundingClientRect();
        var pos = new Vec(e.pageX - clientRect.left, e.pageY - clientRect.top);
        var c = Color.fromHSV(pos.x / 255, this.hsv.s, this.hsv.v);
        this.app.colorFg = c;
      }
    },
    mouseupHueBar(e) {
      this.isMouseDownHue = false;
    },

    updateCanvas() {
      const canvas = this.$refs.canvas;
      canvas.width = 256;
      canvas.height = 256;
      var ctx = canvas.getContext("2d");

      this.hsv = this.app.colorFg.toHSV();

      let idata = ctx.getImageData(0, 0, canvas.width, canvas.height);
      for (let y = 0; y < canvas.height; y++) {
        for (let x = 0; x < canvas.width; x++) {
          var i = x + y * canvas.width;
          var I = i * 4;

          var c = Color.fromHSV(this.hsv.h, x / 255, y / 255);

          idata.data[I + 0] = c.r;
          idata.data[I + 1] = c.g;
          idata.data[I + 2] = c.b;
          idata.data[I + 3] = 255; // always falls back to checkerboard, so always actually filled no matter what
        }
      }
      ctx.putImageData(idata, 0, 0);
    },
    updateHueBar() {
      const canvas = this.$refs.hueBar;
      canvas.width = 256;
      canvas.height = 1;
      var ctx = canvas.getContext("2d");

      let idata = ctx.getImageData(0, 0, canvas.width, canvas.height);
      for (let y = 0; y < canvas.height; y++) {
        for (let x = 0; x < canvas.width; x++) {
          var i = x + y * canvas.width;
          var I = i * 4;

          var c = Color.fromHSV(x / 255, 1, 1);

          idata.data[I + 0] = c.r;
          idata.data[I + 1] = c.g;
          idata.data[I + 2] = c.b;
          idata.data[I + 3] = 255; // always falls back to checkerboard, so always actually filled no matter what
        }
      }
      ctx.putImageData(idata, 0, 0);
    }
  },

  watch: {
    "app.colorFg"() {
      this.updateCanvas();
    }
  },

  mounted() {
    this.updateCanvas();
    this.updateHueBar();
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
  vertical-align: top;
  margin: 4px 0 0 0;
}

.hue-bar {
  height: 16px;
  width: 256px;
}
</style>