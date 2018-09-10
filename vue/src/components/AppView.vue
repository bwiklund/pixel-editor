<template>
  <div class="hello">
    <header>
      <a v-for="(doc, i) in app.docs" v-bind:key="doc.guid" v-on:click="app.activeDocIndex = i" :class="{active: app.activeDocIndex === i}">{{doc.name}}</a>
    </header>
    <DocView :app="app" :doc="app.activeDoc" />
  </div>
</template>

<script>
import DocView from "./DocView.vue";

export default {
  name: "AppView",
  props: ["app"],
  components: {
    DocView
  }
};
</script>

<style scoped>

header {
  background: hsl(245, 10%, 30%);
  color: hsl(245, 10%, 60%);
  border-bottom: 4px solid hsl(245, 10%, 45%);
}

header a {
  display: inline-block;
  padding: 10px 15px;
}

header a.active {
  color: white;
  background: hsl(245, 10%, 45%);
  text-decoration: underline;
}
</style>
