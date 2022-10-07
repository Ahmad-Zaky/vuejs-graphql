<template>
  <div>
    <h3>Tasks List</h3>
    <ul>
      <li v-for="task in tasks" :key="task.id">
        {{ task.title }}
      </li>
    </ul>
  </div>
</template>

<script>
import TASK_QUERY from "@/graphql/Tasks.gql";

export default {
  name: 'TaskList',
  data() {
    return {
      tasks: null
    };
  },
  apollo : {
    tasks: TASK_QUERY
  }
}
</script>