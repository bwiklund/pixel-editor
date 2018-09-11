<template>
  <div class="app">
    <header>
      <a v-for="(doc, i) in app.docs" :key="doc.guid" :class="{active: app.activeDocIndex === i}" @click="app.activeDocIndex = i">{{doc.name}}</a>
      <a v-on:click="openFile">LOADTEST</a>
    </header>
    <main>
      <div class="sidebar">
        <ColorPicker :app="app" />
        <Palette :app="app" :colors="app.palette" />
      </div>
      <DocView v-for="doc in app.docs" :key="doc.guid" :app="app" :doc="app.activeDoc" v-show="app.activeDoc === doc" />
    </main>
  </div>
</template>

<script>
import DocView from "./DocView.vue";
import ColorPicker from "./ColorPicker.vue";
import Palette from "./Palette.vue";

import { Doc } from "../models/Doc";
import { newDocFromImage } from "../models/ImageImporter";

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
      if (e.keyCode == 78) {
        // n
        this.app.activeDoc.newLayer();
      }
      if (e.keyCode == 69) {
        // e
        this.app.activeTool = this.app.eraserTool;
      }
    },
    keyup(e) {
      if (e.repeat) return;
      if (e.keyCode == 32) {
        //space
        this.app.popTool();
      }
    },
    openFile() {
      var doc = Doc.load();
      this.app.docs.push(doc);
      this.app.activeDocIndex = this.app.docs.length - 1;
    }
  },
  mounted() {
    window.addEventListener("keydown", this.keydown);
    window.addEventListener("keyup", this.keyup);

    this.app.docs.push(newDocFromImage("lunaAvatar_neutral_0.png", () => {}));
    this.app.docs.push(newDocFromImage("peepAvatar_neutral_0.png", () => {}));
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
