import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

Vue.config.productionTip = false

console.log(store.state.count)
store.commit('increment')
console.log(store.state.count)

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
