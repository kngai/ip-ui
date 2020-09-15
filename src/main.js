import Vue from 'vue'
import App from './App.vue'
import router from './router'
import vuetify from './plugins/vuetify';
import vuelayers from './plugins/vuelayers';
import store from './store'
import i18n from './i18n'

Vue.config.productionTip = false

new Vue({
  router,
  vuetify,
  vuelayers,
  store,
  i18n,
  render: h => h(App)
}).$mount('#app')
