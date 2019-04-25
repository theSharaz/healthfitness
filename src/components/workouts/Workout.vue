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

    <v-layout v-else>
      <v-flex x12>
        <v-card>

          <v-card-title>
            <h2 class="red--text">{{workout.title}}</h2>
            <template v-if="userIsCreator">
              <v-spacer></v-spacer>
              <app-edit-workout-details-dialog
              :workout="workout">
              </app-edit-workout-details-dialog>
            </template>
          </v-card-title>
          <v-img
            :src="workout.imageUrl"
            height="400px">
          </v-img>
          <v-card-text>
            <div>
              <div class="info--text">
                {{workout.date | date}} - {{workout.location}}
              </div>
              <div >
                {{workout.description}}
              </div>
            </div>       
          </v-card-text>
          <v-card-actions>
          <v-spacer></v-spacer>
            <v-btn class="primary">Register</v-btn>
          </v-card-actions>

        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>
 
<script>
import 'es6-promise/auto';

  export default {
    props: ['id'],
    computed: {
      workout () {
        return this.$store.getters.loadedWorkout(this.id)
      },
      userIsAuthenticated () {
        // console.log('id from store')
        // console.log(this.$store.getters.user.id)
        // console.log('id from workout')
        // console.log(this.workout.creatorId)
         return this.$store.getters.user !== null &&  this.$store.getters.user !== undefined
      },
      userIsCreator () {
        if (!this.userIsAuthenticated) {
          return false
        }
        return this.$store.getters.user.id == this.workout.creatorId
      },
      loading () {
        return this.$store.getters.loading
      }
    }
  }
</script>

<style>

</style>
