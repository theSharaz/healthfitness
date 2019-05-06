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
import EditWorkoutDetailsDialog from './components/workouts/Edit/EditWorkoutDetailsDialog.vue'
import EditWorkoutDateDialog from './components/workouts/Edit/EditWorkoutDateDialog.vue'
import EditWorkoutTimeDialog from './components/workouts/Edit/EditWorkoutTimeDialog.vue'
import RegisterDialog from './components/workouts/Registration/RegisterDialog.vue'
import CreateProfileDialog from './components/user/prof/CreateProfileDialog.vue'
import EditProfileDialog from './components/user/prof/EditProfileDialog.vue'


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
Vue.component('app-edit-workout-details-dialog', EditWorkoutDetailsDialog)
Vue.component('app-edit-workout-date-dialog', EditWorkoutDateDialog)
Vue.component('app-edit-workout-time-dialog', EditWorkoutTimeDialog)
Vue.component('app-workout-register-dialog', RegisterDialog)
Vue.component('app-create-profile-dialog', CreateProfileDialog)
Vue.component('app-edit-profile-dialog', EditProfileDialog)


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
        this.$store.dispatch('fetchUserData')


      }
     })
     this.$store.dispatch('loadWorkouts')
  },
  render: h => h(App)
}).$mount('#app')
