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
* {
  margin: 0px;
  padding: 0px;
}

body {
  background: hsl(245, 10%, 21%);
  color: white;
  font-family: sans-serif;
  user-select: none;
  overflow: hidden;
}

#app {
  position: absolute;
  top: 0px;
  bottom: 0px;
  width: 100%;
}
</style>
