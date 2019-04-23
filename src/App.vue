<template>
  <v-app>

    <v-toolbar dark class="primary">

      <v-toolbar-side-icon @click.stop="sideNav = !sideNav" 
      class="hidden-sm-and-up">
      </v-toolbar-side-icon>
      <v-toolbar-title >
        <router-link to="/" tag="span" style="cursor: pointer">Health and Fitness
        </router-link>
      </v-toolbar-title>

      <v-spacer></v-spacer>
      
      <v-toolbar-items class="hidden-xs-only">
        <v-btn flat v-for="item in menuItems" 
        :key="item.title"
        router
        :to="item.link"> 
          <v-icon left>
          {{item.icon}}
          </v-icon>
          {{item.title}}
        </v-btn>

        <v-btn 
        flat 
        v-if="userIsAuthenticated"
        @click="onLogout"> 
          <v-icon left dark>
          exit_to_app
          </v-icon>
          Logout
        </v-btn>        
      </v-toolbar-items>

    </v-toolbar>


    <main>

      <router-view></router-view>

    </main>

    <v-layout>
      <v-navigation-drawer temporary v-model="sideNav">

      <v-list>

        <v-list-tile 
        v-for="item in menuItems" 
        :key="item.title"
        router
        :to="item.link">
          <v-list-tile-action>
            <v-icon>
            {{item.icon}}
            </v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            {{item.title}}
          </v-list-tile-content>
        </v-list-tile>

        <v-list-tile  
            v-if="userIsAuthenticated"
            @click="onLogout">
          <v-list-tile-action>
            <v-icon>
              exit_to_app
            </v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            Logout
          </v-list-tile-content>
        </v-list-tile>  

      </v-list>

    </v-navigation-drawer> 
    </v-layout>

  </v-app>
</template>

<script>
import HelloWorld from './components/HelloWorld';
import 'es6-promise/auto';

export default {

  data () {
    return {
      sideNav: false
    }
  },
  computed: {
    menuItems () {
      let menuItems = [
        {icon: 'face', title: 'Sign Up', link: '/sUp'},
        {icon: 'lock_open', title: 'Sign In', link: '/sIn'}    
      ]
      if (this.userIsAuthenticated) {
        menuItems = [
            {icon: 'fitness_center', title: 'Group Workouts', link: '/gw'},
            {icon: 'visibility_off', title: 'Private Workouts', link: '/pvtw'},
            {icon: 'accessibility_new', title: 'Create Workout', link: '/crtw/new'},
            {icon: 'accessibility_new', title: 'My Workouts', link: '/myw'},
            {icon: 'person', title: 'Profile', link: '/prof'}
        ]
      }
      return menuItems 
    },
    userIsAuthenticated () {
      return this.$store.getters.user !== null && this.$store.getters.user !== undefined
    }
  },
  methods: {
    onLogout () {
      this.$store.dispatch('logout')
    }
  }

}
</script>

<style lang="stylus">
  @import '~vuetify/src/stylus/main'

  

</style>


