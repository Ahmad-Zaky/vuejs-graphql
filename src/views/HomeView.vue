<template>
  <div class="home">
    <TasksComponent />
  </div>
</template>

<script>
// @ is an alias to /src
import TasksComponent from '@/components/TasksComponent.vue'

export default {
  name: 'HomeView',
  components: {
    TasksComponent
  }
}
</script>
