import Vue from 'vue'
import App from './App.vue'
import { createProvider } from './vue-apollo'
import 'regenerator-runtime/runtime'
import router from './router'
import store from './store'

Vue.config.productionTip = false

new Vue({
  apolloProvider: createProvider(),
  router,
  store,
  render: h => h(App)
}).$mount('#app')
