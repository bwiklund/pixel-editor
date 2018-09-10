<template>
  <div class="app">
    <header>
      <a v-for="(doc, i) in app.docs" v-bind:key="doc.guid" v-on:click="app.activeDocIndex = i" :class="{active: app.activeDocIndex === i}">{{doc.name}}</a>
    </header>
    <main>
      <div class="sidebar">
        <ColorPicker :app="app" />
      </div>
      <DocView :app="app" :doc="app.activeDoc" />
    </main>
  </div>
</template>

<script>
import DocView from "./DocView.vue";
import ColorPicker from "./ColorPicker.vue";

export default {
  name: "AppView",
  props: ["app"],
  components: {
    DocView,
    ColorPicker
  }
};
</script>

<style scoped>

.app {
  display: flex;
  flex-flow: column;
  position: absolute;
  top: 0px;
  bottom: 0px;
  width: 100%;
}

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

main {
  display: flex;
  flex-grow: 1;
}

.sidebar {
  width: 264px; /* 256 + 4 border * 2*/
  background: hsl(245, 10%, 18%);
}
</style>
