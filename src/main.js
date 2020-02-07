import Vue from 'vue'
import App from './App.vue'
import router from './router/index'
import Toasted from 'vue-toasted'
import VueLodash from 'vue-lodash'
import vuetify from './plugins/vuetify'
import 'vuetify/dist/vuetify.min.css'

Vue.config.productionTip = false
Vue.use(Toasted, { singleton: true })
Vue.use(VueLodash)

new Vue({
  vuetify,
  router,
  render: h => h(App),
  beforeMount () {
    const name = this.$vuetify.breakpoint.name
    Vue.prototype.isMobile = name === 'xs' || name === 'sm'
  }
}).$mount('#app')
