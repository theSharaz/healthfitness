<template>
  <v-container>

    <v-layout row wrap v-if="loading">
      <v-flex xs12 class="text-xs-center">
          <v-progress-linear 
          :indeterminate="true"

          class="info"
          >
          </v-progress-linear>
      </v-flex>
    </v-layout>

    <v-layout align-center justify-center row  v-else>
      <v-flex xs12>
        <v-card>

          <v-card-title>
            <template>
          <app-create-profile-dialog right></app-create-profile-dialog>
            </template>
          </v-card-title>
          <v-card-text >


          </v-card-text>


        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>
 
<script>
import 'es6-promise/auto';

  export default {
        data: () => ({
      showMenu: false,
      x: 0,
      y: 0
    }),
    computed: {
      loading () {
        return this.$store.getters.loading
      }
    }
  }
  
</script>

<style>

</style>
