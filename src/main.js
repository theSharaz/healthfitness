import Vue from 'vue'
import './plugins/vuetify'
import App from './App.vue'
import router from './router'
import Vuetify from 'vuetify'
import colors from 'vuetify/es5/util/colors'


Vue.use(Vuetify, {
  theme: {
    primary: colors.red.darken1, // #E53935
    secondary: colors.red.accent2,
    accent: colors.grey.lighten1,
    error: colors.amber.darken2,
    info: colors.blue.lighten1,
    warning: colors.red.accent4,
    success: colors.green.lighten2
  }
})

Vue.config.productionTip = false



new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
