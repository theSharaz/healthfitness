<template>
  <v-container>

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
                :trainerid="trainer.id"></app-book-workout-dialog>
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
      hasProfile () {
        console.log(this.profile)
        return this.$store.getters.user.profile !== null &&  this.$store.getters.user.profile !== undefined
      },
      profileIsAvailable () {
        if (!this.hasProfile) {
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

    }

  }
</script>

<style>

</style>
