<template>
  <div id="app">
    <div>
      <Tasks />
    </div>
  </div>
</template>

<script>
import Tasks from './components/Tasks.vue'

export default {
  name: 'App',
  components: {
    Tasks
  }
}
</script>

<style>

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  margin-top: 60px;
}

.center {
  text-align: center;
}

</style>
