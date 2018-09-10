<template>
  <div class="timeline">
    <div class="layer" v-for="(layer, i) in doc.layers" v-bind:key="i">{{layer.name}}</div>
  </div>
</template>

<script>
export default {
  name: "Timeline",
  props: ["app", "doc"]
};
</script>

<style>
.timeline {
  background: hsl(245, 10%, 45%);
  display: block;
}
</style>