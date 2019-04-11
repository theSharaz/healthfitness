<template>
  <v-container>

    <v-layout row wrap v-for="workout in workouts" :key="workout.id" class="mb-2">
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
                  <div>{{workout.date}}</div>
                </div>
              </v-card-title>
              <v-card-actions>
              <v-btn flat :to="'workouts/' + workout.id" >
                <v-icon light>arrow_forward</v-icon>
                Join Workout
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
      workouts () {
        return this.$store.getters.loadedWorkouts
      }
    }
  }

</script>

<style>

</style>
