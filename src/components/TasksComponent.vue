<template>
  <div>

    <button @click="openForm = true" v-show="!openForm">Add a task</button>        

    <div v-show="openForm">
      <h3>Add Task</h3>

      <input type="text" v-model="task.title" placeholder="Enter title ..." required>
      <div v-show="errors.title" style="color: red;">
        <ul class="list-unstyled p-0">
          <li v-for="(error, index) in errors.title" :key="index">
            {{ error }}
          </li>
        </ul>
      </div>

      <br>
      <br>

      <textarea v-model="task.description" id="" cols="30" rows="10" placeholder="Enter description ..."></textarea>
      <div v-show="errors.description" style="color: red;">
        <ul class="list-unstyled p-0">
          <li v-for="(error, index) in errors.description" :key="index">
            {{ error }}
          </li>
        </ul>
      </div>
      
      <br>
      <br>

      <button @click="saveTask">Save</button>        
    </div>
    
    <div style="width: 400px">
      <h3>Tasks List</h3>
      <ul>
        <li v-for="task in tasks" :key="task.id">
          <p class="inline-block truncate m-0">
            {{ task.title }}
          </p>
          
          <!-- Edit -->
          <span
            class="mx-2 shadow circle"
            style="color: blue; cursor: pointer; font-weight: 600;" 
            @click="editTask(task.id)"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pencil-fill" viewBox="0 0 16 16">
              <path d="M12.854.146a.5.5 0 0 0-.707 0L10.5 1.793 14.207 5.5l1.647-1.646a.5.5 0 0 0 0-.708l-3-3zm.646 6.061L9.793 2.5 3.293 9H3.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.207l6.5-6.5zm-7.468 7.468A.5.5 0 0 1 6 13.5V13h-.5a.5.5 0 0 1-.5-.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.5-.5V10h-.5a.499.499 0 0 1-.175-.032l-.179.178a.5.5 0 0 0-.11.168l-2 5a.5.5 0 0 0 .65.65l5-2a.5.5 0 0 0 .168-.11l.178-.178z"/>
            </svg>
          </span>

          <!-- Delete -->
          <span
            class="mx-2 shadow circle"
            style="color: red; cursor: pointer; font-weight: 600;" 
            @click="deleteTask(task.id)"
          >
            X
          </span>
        </li>
      </ul>

      <br>

      <div v-if="paginator">
        <div>
          Page: {{ paginator.currentPage }} / {{ paginator.lastPage }}
        </div>
          
        <br>

        <div class="inline-block">
          Displaying {{ paginator.count }} entries out of {{ paginator.total }}
        </div>

        <br>
        <br>

        <div style="display:flex; justify-content:space-between;">
          <button 
            @click="page--"
            :disabled="paginator.currentPage <= 1"
          >
            &larr; Previous
          </button>

          <button 
            @click="page++" 
            :disabled="paginator.currentPage >= paginator.lastPage"
          >
            Next &rarr;
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import TASKS_QUERY from "@/graphql/Tasks/List.gql";
import TASK_QUERY from "@/graphql/Tasks/Show.gql";
import ADD_TASK_MUTATION from "@/graphql/Tasks/Add.gql";
import DELETE_TASK_MUTATION from "@/graphql/Tasks/Delete.gql";
import UPDATE_TASK_MUTATION from "@/graphql/Tasks/Update.gql";

export default {
  name: 'TasksComponent',
  data() {
    return {
      tasks: null,
      task: {
        user_id: null,
        title: '',
        description: '',
      },
      openForm: false,
      editing: false,
      taskId: null,
      perPage: 10,
      page: 1,
      paginator: null,
      errors: {
        title: null,
        description: null
      }
    };
  },
  methods: {
    saveTask() {
      // For Testing purposes only
      if (! this.editing) this.task.user_id = 1;
      else this.task['id'] = this.taskId;

      this.$apollo.mutate({
        mutation: this.editing ? UPDATE_TASK_MUTATION : ADD_TASK_MUTATION,
        variables: this.task
      }).then(() => {
        this.resetForm();
        this.init();
      }).catch((error) => {
        console.log('error', error.graphQLErrors)
        error.graphQLErrors.forEach((extensions) => {
          const extension = extensions.extensions;
          if (extension.category === "validation") {
            this.errors.title = extension.validation['input.title']
            this.errors.description = extension.validation['input.description']
          }
          console.log('extensions', extensions, this.errors)
        });
      });
    },
    deleteTask(id) {
      // In case deleting the edited task
      if (id === this.taskId) this.resetForm();

      this.$apollo.mutate({
        mutation: DELETE_TASK_MUTATION,
        variables: { id }
      }).then(() => this.init() );
    },
    editTask(id) {
      this.resetForm();

      this.openForm = true; // Open form
      this.editing = true; // Set editing flag to true

      this.getTask(id);
    },
    getTask(id) {
      // Clear Cache
      this
        .$apollo
        .queries
        .task
        .client
        .clearStore();
      
      // Refetch Task by updating taskId value
      this.taskId = id;
    },
    init() {
      this.$apollo.queries.tasks.refetch();
    },
    resetForm() {
        this.taskId = null
        this.task.title = '';
        this.task.description = '';
        this.task.user_id = null;
        this.openForm = false;
        this.editing = false;
        this.errors.title = null;
        this.errors.description = null;
    }
  },
  apollo : {
    tasks: {
      query: TASKS_QUERY,
      variables() {
        return {
          perPage: this.perPage,
          page: this.page
        }
      },
      update(data) {
        this.paginator = data.tasks.paginatorInfo;
        
        return data.tasks.data;
      },
      fetchPolicy: 'network-only',
    },
    task: {
      query: TASK_QUERY,
      variables() {
        return {
          id: this.taskId
        }
      },
      skip () {
        return !this.taskId
      },
      fetchPolicy: 'network-only',
    }
  }
}
</script>

<style>
  .truncate {
    width: 250px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .inline-block {
    display: inline-block;
  }

  .m-0 {
    margin: 0px;
  }

  .p-0 {
    padding: 0px;
  }

  .mx-2 {
    margin-left: 1rem;
    margin-right: 1rem;
  }

  .shadow {
    box-shadow: 5px 5px 2px lightgrey;
  }

  .circle {
    border-radius: 50%;
  }

  .list-unstyled {
    list-style-type: none;
  }
</style>