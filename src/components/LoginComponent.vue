<template>
  <div class="center">
    <h1>Login</h1>
    
    <br>

    <!-- START - Errors Block  -->
    <div v-show="errors.other" style="background-color: lightred; color: red; padding: 5px;">
      <ul class="list-unstyled p-0">
        <li v-for="(error, index) in errors.other" :key="index">
          {{ error }}
        </li>
      </ul>
    </div>
    <!-- END - Errors Block  -->

    <form @submit.prevent="submitLogin">
      <span>Email</span>
      <br/>
      <input v-model="auth.email" type="email"/>
      <div v-show="errors.email" style="color: red;">
        <ul class="list-unstyled p-0">
          <li v-for="(error, index) in errors.email" :key="index">
            {{ error }}
          </li>
        </ul>
      </div>

      <br/><br/>
      <span>Password</span>
      <br/>
      <input v-model="auth.password" type="password"/>
      <div v-show="errors.password" style="color: red;">
        <ul class="list-unstyled p-0">
          <li v-for="(error, index) in errors.password" :key="index">
            {{ error }}
          </li>
        </ul>
      </div>

      <br/><br/>
      <button type="submit">Log In</button>
    </form>
  </div>
</template>

<script>

import { mapActions } from "vuex";

export default {
  name: 'LoginComponent',
  data() {
    return {
      auth: {
        email: '',
        password: '',
        device_name: ''
      },
      errors: {
        email: null,
        password: null,
        other: null
      }
    };
  },
  methods: {
    ...mapActions("Auth", ["login"]),
    submitLogin() {
      
      // Validate if Credentials are empty
      if (! this.auth.email) {
        this.errors.email = ['Email is required'];
        
        return;
      }

      if (! this.auth.password) {
        this.errors.password = ['Password is required'];
        
        return;
      }

      // Set Device Name which will be the browser info. in web
      this.auth.device_name = navigator.userAgent;

      this
      .login(this.auth)
      .then(() => {
        this.$router.push("/");
      })
      .catch((error) => {
        const response = error?.response;

        // Validation errors
        if (response && response?.status === 422) {
          let errors = response?.data?.errors;
          for (error in errors) {
            if (error === 'email') {
              this.errors.email = errors.email;
              
              continue;
            }

            if (error === 'password') {
              this.errors.password = errors.password;
            
              continue;
            }

            if (this.errors.other) {
              this.errors.other.push(errors[error])
            }
          }
          
          return;
        }

        // Too many attempts error
        if (response && response?.status === 422) {
          this.errors.other = ["Too Many Attempts, please try again later."];

          return;
        }

        // Not validation errors
        this.errors.other = ["Something went wrong, please contact support !"];
      });
    },
    resetForm() {
      this.auth.email = '';
      this.auth.password = '';
      this.auth.device_name = '';
      this.errors.email = null;
      this.errors.password = null;
      this.errors.other = null;
    }
  },
  apollo : {}
}
</script>