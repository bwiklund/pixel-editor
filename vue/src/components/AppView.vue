<template>
  <div class="hello">
    <ol>
      <li v-for="doc in app.docs" v-bind:key="doc.guid">{{doc.name}}</li>
    </ol>
  </div>
</template>

<script>
export default {
  name: "AppView",
  props: ["app"]
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
