<template>
  <div id="app">
    <nav class="center">
      <router-link to="/">Home</router-link> 
      <div v-if="isAuthenticated">
        <div>
          Hi, {{ user.name }} ({{ user.email }})
          <button type="button" @click="submitLogout">Log out</button>
        </div>
      </div>
      
      <div class="inline-block" v-else>
        | <router-link to="/login">Login</router-link>
      </div>

    </nav>
    <router-view/>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";

export default {
  beforeCreate() {
    if (! this.$store.getters.isAuthenticated) {
      this.$router.push("/login");
    }
  },
  computed: {
    ...mapGetters("Auth", ["isAuthenticated", "user"]),
  },
  mounted() {
    this.attemptAuthentication();
  },
  methods: {
    ...mapActions("Auth", ["attemptAuthentication", "logout"]),
    submitLogout() {
      this.logout();
      this.$router.push("/login");
    },
  },
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}

nav {
  padding: 30px;
}

nav a {
  font-weight: bold;
  color: #2c3e50;
}

nav a.router-link-exact-active {
  color: #42b983;
}

.center {
  text-align: center;
}

.inline-block {
  display: inline-block;
}

</style>
