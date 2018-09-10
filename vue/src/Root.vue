<template>
  <div id="app">
    <AppView v-bind:app="app"/>
  </div>
</template>

<script>
import AppView from './components/AppView.vue'

class App {
  constructor() {
    this.a = 0;
  }

  foo() {
    this.a++;
  }
}

export default {
  name: 'root',
  components: {
    AppView
  },
  data: function() {
    return {
      app: new App()
    }
  }
}
</script>

<style>

</style>
