<template>
  <div class="palette">
    <div
      class="palette-cell"
      v-for="(color, i) in colors" v-bind:key="i"
      :style="{background: color.toHex()}"
      @mousedown="() => app.colorFg = color"
    ></div>
  </div>
</template>

<script>
import { Color } from '../models/Color';

export default {
  name: "Palette",
  props: ['app', 'colors']
}

</script>

<style scoped>
.palette {
  display: block;
  margin: 4px;
}

.palette-cell {
  width: 32px;
  height: 32px;
  display: inline-block;
  vertical-align:top;
}
</style>