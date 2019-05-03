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

    <v-layout align-center justify-center row  v-if="!profileIsAvailable">
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

        <v-layout
          align-center 
          justify-center 
          row wrap
          fill-height 
          v-if="profileIsAvailable && !loading"
          
          >

      <v-flex
        xs12
      >
        <v-card class="v-card-profile">

            <v-img
            width="150px">
            </v-img>
          <v-flex xs12 sm6 offset-sm5>
            <img 
              :src="profile.imageUrl"
             height="250" width="250">
          </v-flex>
          <v-card-text class="text-xs-center">
            <div>
            
              <div>
                <h2 class="category text-black font-weight-heavy mb-3">Name {{profile.name}}</h2>
              </div>
              <div>
                <h3 class="card-title font-weight-heavy">Email: {{profile.email}}</h3>
              </div>
              <div>
                <h3 class="card-title font-weight-heavy">Phone Number: {{profile.phone}}</h3>
              </div>
              <div>
                <h3 class="card-title font-weight-heavy">Height: {{profile.height}}</h3>
              </div>
              <div>
                <h3 class="card-title font-weight-heavy">Weight: {{profile.weight}}</h3>
              </div>
              <div>
                <p class="card-description font-weight-heavy">About me: Case felt the edge of the room where Case waited. A graphic representation of data abstracted from the banks of every computer in the coffin for Armitage’s call. No light but the muted </p>
              </div>              
            
            
            </div> 



            <app-edit-profile-dialog 
            v-if="profileIsAvailable && !loading"
            :profile="profile" 
            >
            
            </app-edit-profile-dialog>
          </v-card-text>
        </v-card>
      </v-flex>
    </v-layout>

  </v-container>
</template>
 
<script>
import 'es6-promise/auto';

  export default {
    computed: {
      profile () {
      return this.$store.getters.user.profile
      },
      loading () {
        return this.$store.getters.loading
      },
      hasProfile () {
        console.log(this.profile)
        return this.$store.getters.user.profile !== null &&  this.$store.getters.user.profile !== undefined
      },
      profileIsAvailable () {
        if (!this.hasProfile) {
          return false
        }
        return true
      }

    }
  }
  
</script>

<style>

</style>
