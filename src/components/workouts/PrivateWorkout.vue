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
            <v-flex xs12 sm10 md8 offset-sm0 align-center justify-center>
                <v-card>

                <v-card-title v-if="userIsAuthenticated && !profileIsAvailable">
                    <template>
                        <v-btn  block flat class="primary" :to="'/prof'" >
                            <v-icon light>arrow_forward</v-icon>
                            CREATE A PROFILE BEFORE BOOKING PRIVATE CLASSES
                        </v-btn>           
                    </template>
                </v-card-title>

                <v-card-title offset-ml2 align-center justify-center mt-5 block v-if="userIsAuthenticated && !pvtWorkoutIsAvailable">
                    <template>
                      <h1 offset-ml2>
                      {{ pvtWorkoutIsAvailable ? '' : 'No client has booked a private lesson with you' }}
                      </h1>
                    </template>
                </v-card-title>

                </v-card>

            </v-flex>
            </v-layout>



            <v-layout row wrap 
            class="mb-2"
                v-for="client in clientProfile" 
            v-if="pvtWorkoutIsAvailable && !loading">
                <v-flex xs12 sm10 md8 offset-sm1 offset-md2>

                    <v-card class="primary">
                    <v-container fluid>
                        <v-layout row>
                        <v-flex xs5 sm4 md3>
                                          <v-img
                v-if="pvtWorkoutIsAvailable"
                  :src="client.imageUrl"
                  height="130px"
                  contain 
                  left>
                </v-img>

                        </v-flex>
                        <v-flex xs7 sm8 md9>
                            
                            <v-card-title primary-title>
                                <h2 class="">Booking for {{client.date | date}} 
                                
                                <v-btn flat color="secondary" @click="onUnRegisterPvtWorkout(client.pvtid, client.id)"><v-icon>cancel</v-icon></v-btn>

                                </h2>
                                <v-spacer></v-spacer>
                            </v-card-title>

                            <v-card-text>
                            <div>
                                <h2 class="mb-0">Client Name: {{client.name}}</h2>
                                <h3 class="mb-0">Phone #: {{client.phone}} <span></span> Email: {{client.email}}</h3>
                                <h3 class="mb-0">Weight: {{client.weight}}</h3>
                                <h3 class="mb-0">Height: {{client.height}}</h3>
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

        const clie = this.$store.getters.user.privateWorkouts
        const client = []
          for(let key in clie){
                    // console.log('LOADED TRAINER '+this.$store.getters.loadedTrainer(trai[key].trainer),
              // trai[key].date)
            client.push(
              {...this.$store.getters.loadedClient(clie[key].client),
              date: clie[key].date,
              pvtid: clie[key].pvtid
              }
            
            )
        }
        return client    
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
        return this.$store.getters.user.privateWorkouts[0] !== null &&  this.$store.getters.user.privateWorkouts[0] !== undefined
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
        onUnRegisterPvtWorkout (pvtid,otherID) {

            if (this.pvtWorkoutIsAvailable) {
                this.$store.dispatch('LEunRegisterPrivateWorkout', {pvtid: pvtid,
            otherID: otherID})
            } 
        }
    }

  }
</script>

<style>

</style>
