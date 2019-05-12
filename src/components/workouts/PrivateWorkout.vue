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

            <v-layout align-center justify-center row  v-if="!loading || !profileIsAvailable">
            <v-flex xs12>
                <v-card>

                <v-card-title v-if="userIsAuthenticated && !profileIsAvailable">
                    <template>
                        <v-btn  block flat class="primary" :to="'/prof'" >
                            <v-icon light>arrow_forward</v-icon>
                            CREATE A PROFILE BEFORE BOOKING PRIVATE CLASSES
                        </v-btn>           
                    </template>
                </v-card-title>

                <v-card-title align-center justify-center mt-5 block v-if="userIsAuthenticated && !pvtWorkoutIsAvailable">
                    <template>
                    
                        <div>
                            <h1>
                            {{ pvtWorkoutIsAvailable ? '' : 'No client has booked a private lesson with you' }}
                            </h1>
                        </div>

                    </template>
                </v-card-title>

                </v-card>

            </v-flex>
            </v-layout>



            <v-layout row wrap 
            class="mb-2"
            v-if="pvtWorkoutIsAvailable && !loading">
                <v-flex xs12 sm10 md8 offset-sm1 offset-md2>

                    <v-card class="primary">
                    <v-container fluid>
                        <v-layout row>
                        <v-flex xs5 sm4 md3>


                        </v-flex>
                        <v-flex xs7 sm8 md9>
                            
                            <v-card-title primary-title>
                                <h2 class="">Booking for {{privateWorkout.date | date}} 
                                
                                <v-btn flat color="secondary" @click="onUnRegisterPvtWorkout"><v-icon>cancel</v-icon></v-btn>

                                </h2>
                                <v-spacer></v-spacer>
                            </v-card-title>

                            <v-card-text>
                            <div>
                                <h2 class="mb-0">Client Name: {{clientProfile.name}}</h2>
                                <h3 class="mb-0">Phone #: {{clientProfile.phone}} <span></span> Email: {{clientProfile.email}}</h3>
                                <h3 class="mb-0">Weight: {{clientProfile.weight}}</h3>
                                <h3 class="mb-0">Height: {{clientProfile.height}}</h3>
                            </div>
                            </v-card-text>

                        </v-flex>
                        </v-layout>
                    </v-container>

                    </v-card>

                </v-flex>
            </v-layout>

          </v-container>

        </v-card>

      </v-flex>
    </v-layout>

  </v-container>
</template>


<script>
  export default {
    computed: {
      loading () {
        return this.$store.getters.loading
      },
      clientProfiles () {
        
            console.log('Loaded clients')
            console.log(this.$store.getters.loadedClients)
        return this.$store.getters.loadedClients
      },
      clientProfile () {
        
            console.log('Loaded clients')
            console.log(this.$store.getters.loadedClient(this.privateWorkout.client))
        return this.$store.getters.loadedClient(this.privateWorkout.client)        
      },
      privateWorkout () {
        
            // console.log('Loaded trainers')
            // console.log(this.$store.getters.loadedTrainers)
        return this.$store.getters.user.privateWorkouts
      },
      hasProfile () {
            // console.log('my workouts.vue')
            // console.log(this.$store.getters.user)
        return this.$store.getters.user.profile !== null &&  this.$store.getters.user.profile !== undefined
      },
      profileIsAvailable () {
        if (!this.hasProfile) {
          return false
        }
        return true
      },
      hasPrivateWorkout () {
        return this.$store.getters.user.privateWorkouts !== null &&  this.$store.getters.user.privateWorkouts !== undefined
      },
      pvtWorkoutIsAvailable () {
        if (!this.hasPrivateWorkout) {
          return false
        }
        return true
      },
      userIsAuthenticated () {
         return this.$store.getters.user !== null &&  this.$store.getters.user !== undefined
      }

    },
    methods: {
        onUnRegisterPvtWorkout () {
            if (this.pvtWorkoutIsAvailable) {
                this.$store.dispatch('unRegisterPrivateWorkout', this.privateWorkout.client)
            } 
        }
    }

  }
</script>

<style>

</style>
