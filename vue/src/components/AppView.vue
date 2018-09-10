<template>
  <div class="app">
    <header>
      <a v-for="(doc, i) in app.docs" v-bind:key="doc.guid" v-on:click="app.activeDocIndex = i" :class="{active: app.activeDocIndex === i}">{{doc.name}}</a>
    </header>
    <main>
      <div class="sidebar">
        <ColorPicker :app="app" />
        <Palette :app="app" :colors="app.palette" />
      </div>
      <DocView :app="app" :doc="app.activeDoc" />
    </main>
  </div>
</template>

<script>
import DocView from "./DocView.vue";
import ColorPicker from "./ColorPicker.vue";
import Palette from "./Palette.vue";

export default {
  name: "AppView",
  props: ["app"],
  components: {
    DocView,
    Palette,
    ColorPicker
  },
  methods: {
    keydown(e) {
      if (e.repeat) return;
      if (e.keyCode == 32) {
        //space
        this.app.pushTool(this.app.pannerTool);
      }
    },
    keyup(e) {
      if (e.repeat) return;
      if (e.keyCode == 32) {
        //space
        this.app.popTool();
      }
    }
  },
  mounted() {
    window.addEventListener("keydown", this.keydown);
    window.addEventListener("keyup", this.keyup);
  },
  beforeDestroy() {
    window.removeEventListener("keydown", this.keydown);
    window.removeEventListener("keyup", this.keyup);
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
