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

    <v-layout align-center justify-center row  v-if="!loading || !profileIsAvailable || userIsMember">
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

          <v-card-title block v-if="userIsAuthenticated && userIsMember">
            <template>
              <app-membership-dialog block flat class="primary">
              </app-membership-dialog>       
            </template>
          </v-card-title>

        </v-card>

      </v-flex>
    </v-layout>

    <v-layout row wrap 
    class="mb-2"
    v-if="pvtWorkoutIsAvailable && !loading && !userIsMember && trainerProfile">
      <v-flex xs12 offset-sm5  offset-ml2>

        <h2 align-center justify-center>Private Booking</h2>


      </v-flex>
    </v-layout>

    <v-layout row wrap 
    class="mb-2"
    v-for="trainer in trainerProfile" 
    :key="trainer"
    v-if="pvtWorkoutIsAvailable && !loading && !userIsMember && trainerProfile">
      <v-flex xs12 sm10 md8 offset-sm1 offset-md2>

        <v-card class="primary">
          <v-container fluid>
            <v-layout row>
              <v-flex xs12>
                
                <v-img
                v-if="pvtWorkoutIsAvailable"
                  :src="trainer.imageUrl"
                  height="130px"
                  contain 
                  left>
                </v-img>

                <v-divider></v-divider>

                <v-card-text>
                  <h2 class="mb-0">Coach: {{trainer.name}}</h2>
                </v-card-text>

              </v-flex>
              <v-flex xs7 sm8 md9>
                
                <v-card-title primary-title>
                    <h2 class="">Booking: {{trainer.date | date}}</h2>
                </v-card-title>




              </v-flex>

              <v-flex xs1 sm1 md1>

                <v-card-actions>
                <v-spacer></v-spacer>
                  <v-btn flat color="secondary" @click="onUnRegisterPvtWorkout(trainer.pvtid, trainer.id)"><v-icon>cancel</v-icon></v-btn>
                </v-card-actions>


              </v-flex>
            </v-layout>
          </v-container>

        </v-card>

      </v-flex>
    </v-layout>

  <v-divider></v-divider>


    <v-layout row wrap 
    class="mb-2"
    v-if="profileIsAvailable && !loading && !userIsMember">
      <v-flex xs12 sm10 md8 offset-sm5  offset-ml2>
        <h2 align-center justify-center>Book A Private Lesson</h2>
      </v-flex>
    </v-layout>  

    <v-layout row wrap 
    v-for="trainer in trainerProfiles" 
    :key="trainer.id" 
    class="mb-2"
    v-if="profileIsAvailable && !loading && !userIsMember">
      <v-flex xs12 sm10 md8 offset-sm1 offset-md2>

        <v-card class="secondary">
          <v-container fluid>
            <v-layout row>
              <v-flex xs5 sm4 md3>
                
                <v-img
                  :src="trainer.imageUrl"
                  height="130px"
                  contain>
                </v-img>

              </v-flex>
              <v-flex xs7 sm8 md9>
                
                <v-card-title primary-title>
                  <div>
                    <h2 class="mb-0">{{trainer.name}}</h2>
                  </div>
                </v-card-title>

                <v-card-actions>
                  <app-book-workout-dialog
                  :trainerid="trainer.id"
                  
                  ></app-book-workout-dialog>
                </v-card-actions>



              </v-flex>
            </v-layout>
          </v-container>
        </v-card>
      </v-flex>
    </v-layout>

        <v-layout align-center justify-center row wrap  
          class="mb-2"
          v-if="profileIsAvailable && !loading && !userIsMember && registeredWorkouts">
            <v-flex xs12 sm10 md8 offset-sm5  offset-ml2>
              <h2 align-center justify-center>Registered Workouts</h2>
            </v-flex>
        </v-layout>     

        <v-layout row wrap 
        v-for="workout in registeredWorkouts" 
        :key="workout.id" 
        class="mb-2"
        v-if="profileIsAvailable && !loading && !userIsMember && registeredWorkouts">
          <v-flex xs12 sm10 md8 offset-sm1 offset-md2>

            <v-card class="info">
              <v-container fluid>
                <v-layout row>

                  <v-flex xs5 sm4 md3>
                    <v-img
                      :src="workout.imageUrl"
                      height="130px"
                      contain>
                      </v-img>
                  </v-flex>
                  <v-flex xs7 sm8 md9>
                    <v-card-title primary-title>
                      <div>
                        <h4 class="mb-0">{{workout.title}}</h4>
                        <div>{{workout.date | date}}</div>
                      </div>
                    </v-card-title>

                    <v-card-actions>
                      <v-btn flat :to="'workouts/' + workout.id" >
                        <v-icon light>arrow_forward</v-icon>
                        View More
                      </v-btn>
                    </v-card-actions>
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
      trainerProfiles () {
        
            // console.log('Loaded trainers')
            // console.log(this.$store.getters.loadedTrainers)
        return this.$store.getters.loadedTrainers
      },
      registeredWorkouts () {
            // console.log('Loaded trainers')
            // console.log(this.$store.getters.loadedTrainers)
        const work = this.$store.getters.user.registeredWorkouts
        // console.log("const work structure")
        // console.log(work)
        const regWork = []
        for(let key in work){
            regWork.push(this.$store.getters.loadedWorkout(work[key]))
        }

        // console.log("user REGISTERED PUB WORKOUTS")
        // console.log(regWork)
        return regWork

      },
      trainerProfile () {
        
        const trai = this.$store.getters.user.privateWorkouts
        const train = []
          for(let key in trai){
                    // console.log('LOADED TRAINER '+this.$store.getters.loadedTrainer(trai[key].trainer),
              // trai[key].date)
            train.push(
              {...this.$store.getters.loadedTrainer(trai[key].trainer),
              date: trai[key].date,
              pvtid: trai[key].pvtid
              }
            
            )
        }
        return train
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
                    console.log('my workouts.vue')
            console.log(this.$store.getters.user)
        return this.$store.getters.user.privateWorkouts[0] !== null &&  this.$store.getters.user.privateWorkouts[0] !== undefined
      },
      pvtWorkoutIsAvailable () {
        if (!this.hasPrivateWorkout) {
          return false
        }
        return true
      },
      userIsMember () {
        console.log('membership status')
        console.log(this.$store.getters.user.membership)
        return this.$store.getters.user.membership === 'none'
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