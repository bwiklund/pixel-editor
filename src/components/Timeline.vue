<template>
  <div class="timeline">
    <div 
      class="layer" 
      v-for="(layer, i) in doc.layers.slice().reverse()"
      v-bind:key="i"
      :class="{active: doc.activeLayer === layer}"
      @mousedown="(e) => setActiveLayer(layer, doc.layers.length - 1 - i)"
    >
      <a @mousedown="(e) => toggleLayerVisibility(e, layer, doc.layers.length - 1 - i)">{{ layer.isVisible ? "[O]" : "[ ]" }} </a>
      {{layer.name}}
    </div>
  </div>
</template>

<script>
export default {
  name: "Timeline",
  props: ["app", "doc"],
  methods: {
    toggleLayerVisibility(e, layer, i) {
      layer.isVisible = !layer.isVisible;
      this.doc.touch();
      e.stopPropagation();
    },
    setActiveLayer(layer, i) {
      this.doc.activeLayerIndex = i;
      this.doc.touch();
    }
  }
};
</script>

<style>
.timeline {
  background: hsl(245, 10%, 45%);
  display: block;
}

.layer.active {
  background: hsl(245, 10%, 55%);
}
</style>