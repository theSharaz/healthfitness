<template>
  <v-container>

    <v-layout>
      <v-flex x12>
        <v-card>

          <v-card-title>
            <h3 class="white--text">{{workout.title}}</h3>
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
      }
    }
  }
</script>

<style>

</style>
