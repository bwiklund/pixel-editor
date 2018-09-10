<template>
  <div class="hello">
    <ol>
      <li v-for="(doc, i) in app.docs" v-bind:key="doc.guid" v-on:click="app.activeDocIndex=i">{{doc.name}}</li>
    </ol>
    <DocView v-bind:doc="app.activeDoc" />
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
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
