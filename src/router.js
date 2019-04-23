import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/components/Home.vue'
import Profile from '@/components/user/Profile.vue'
import Signin from '@/components/user/Signin.vue'
import Signup from '@/components/user/Signup.vue'
import GroupWorkouts from '@/components/workouts/GroupWorkouts.vue'
import PrivateWorkout from '@/components/workouts/PrivateWorkout.vue'
import MyWorkouts from '@/components/workouts/MyWorkouts.vue'
import CreateWorkout from '@/components/workouts/CreateWorkout.vue'
import Workout from '@/components/workouts/Workout.vue'
import AuthGuard from './auth-guard'

Vue.use(Router)

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Home
    },
    {
      path: '/prof',
      name: 'Profile',
      component: Profile,
      beforeEnter: AuthGuard
    },
    {
      path: '/sIn',
      name: 'Signin',
      component: Signin
    },
    {
      path: '/sUp',
      name: 'Signup',
      component: Signup
    },
    {
      path: '/gw',
      name: 'GroupWorkouts',
      component: GroupWorkouts,
    },
    {
      path: '/pvtw',
      name: 'PrivateWorkout',
      component: PrivateWorkout
    },
    {
      path: '/myw',
      name: 'MyWorkouts',
      component: MyWorkouts
    },
    {
      path: '/crtw/new',
      name: 'CreateWorkout',
      component: CreateWorkout,
      beforeEnter: AuthGuard
    },
    {
      path: '/workouts/:id',
      name: 'Workout',
      props: true,
      component: Workout
    }

  ]
})
