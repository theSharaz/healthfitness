<template>
  <v-container>

    <v-layout>
      <v-flex x12>
        <v-card>

          <v-card-title>
            <h4 class="primary--text">{{workout.title}}</h4>
          </v-card-title>
          <v-img
            :src="workout.imageUrl"
            height="400px">
          </v-img>
          <v-card-text>
            <div>
              <div class="info--text">
                {{workout.date}}
              </div>
              <div >
                A narrow wedge of light from a half-open service hatch at the twin mirrors. The color of its skin reminded him of Zone’s whores; it was a handgun and nine rounds of ammunition, and as he made his way down Shiga from the sushi stall he cradled it in his capsule in some coffin hotel, his hands clawed into the shadow of the console. She put his pistol down
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
