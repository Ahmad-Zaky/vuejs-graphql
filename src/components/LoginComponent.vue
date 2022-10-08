<template>
  <div>
    <h1>Login</h1>
    
    <br>
    
    <form @submit.prevent="submitLogin">
      Email
      <br/>
      <input v-model="email" type="email"/>
      <br/><br/>
      Password
      <br/>
      <input v-model="password" type="password"/>
      <br/><br/>
      <button type="submit">Log In</button>
    </form>
  </div>
</template>

<script>

import axios from "axios";

export default {
  name: 'LoginComponent',
  data() {
    return {
      email: '',
      password: ''
    };
  },
  methods: {
    login() {
      // Prepare Data
      const path = "login";
      const url = process.env.VUE_APP_SERVER_HTTP + path;
      const device_name = navigator.userAgent;

      // Submit Login Request
      axios
          .post(url, {
            email: this.email,
            password: this.password,
            device_name,
          })
          .then((response) => {
            console.log("Token: " + response.data);
            this.$router.push("/");
          })
          .catch((error) => console.log(error));

    }
  },
  apollo : {}
}
</script>