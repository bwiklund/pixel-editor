<template>
  <div id="app">
    <AppView v-bind:app="app"/>
  </div>
</template>

<script>
import AppView from './components/AppView.vue'

import { App } from './models/App';

export default {
  name: 'root',
  components: {
    AppView
  },
  data: function(){
    return {
      app: new App()
    }
  }
}
</script>

<style>

</style>
