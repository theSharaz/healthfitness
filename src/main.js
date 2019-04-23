import Vue from 'vue'
import './plugins/vuetify'
import App from './App.vue'
import router from './router'
import Vuetify from 'vuetify'
import colors from 'vuetify/es5/util/colors'
import { store } from './store'
import DateFilter from './filters/date'
import * as firebase from 'firebase'
import AlertCmp from './components/shared/Alert.vue'


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

Vue.filter('date', DateFilter)
Vue.component('app-alert', AlertCmp)


new Vue({
  router,
  store,
  created () {
     firebase.initializeApp({
      apiKey: 'AIzaSyCmHWfjeiGTS_sw6mIUBPI3tTvK5NJX7Fk',
      authDomain: 'healthfitness-93309.firebaseapp.com',
      databaseURL: 'https://healthfitness-93309.firebaseio.com',
      projectId: 'healthfitness-93309',
      storageBucket: 'healthfitness-93309.appspot.com',
      messagingSenderId: '570451847727'
     })
     firebase.auth().onAuthStateChanged((user) => {
       if (user) {
         this.$store.dispatch('autoSignIn', user)
       }
     })
     this.$store.dispatch('loadWorkouts')
  },
  render: h => h(App)
}).$mount('#app')
