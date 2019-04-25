<template>
  <v-container>

    <v-layout row wrap mb-2>
      <v-flex xs12 sm6 class="text-xs-center text-sm-right">
        <v-btn large  router to='/gw' class='primary'>Explore Group Workouts</v-btn>     
      </v-flex>
      <v-flex xs12 sm6 class="text-xs-center text-sm-left">
        <v-btn large  router to='/pvtw' class='primary'>Private Workouts</v-btn>      
      </v-flex>
    </v-layout>

    <v-layout>
      <v-flex xs12 class="text-xs-center">
          <v-progress-linear 
          :indeterminate="true"
          v-if="loading"
          class="info"
          >
          </v-progress-linear>
      </v-flex>
    </v-layout>

    <v-layout row wrap mt-2 v-if="!loading">
      <v-flex xs12>  

        <v-carousel style="cursor: pointer" hide-delimiters>
          <v-carousel-item
            v-for="workout in workouts"
            :key="workout.id"
            :src="workout.imageUrl"
            @click="onLoadWorkout(workout.id)">
            <div class="title text-xs-center offset-1">
              {{workout.title}}
            </div>
          </v-carousel-item>
        </v-carousel> 

      </v-flex>
    </v-layout>
        <v-layout row wrap mt-2>
      <v-flex xs12 class="text-xs-center">
        <p>Join our awesome workouts</p>
      </v-flex>

    </v-layout>

  </v-container>
</template>

<script>
  export default {
    computed: {
      workouts () {
        return this.$store.getters.featuredWorkouts
      },
      loading () {
        return this.$store.getters.loading
      }
    },
    methods: {
      onLoadWorkout(id) {
        this.$router.push('/workouts/'+id)
      }
    }
  }
</script>

<style scoped>
  .title {
    bottom: 50px;
    background-color: rgba(0,0,0,0.87);
    color: white;
    font-size: 2em;
    padding: 20px;
  }

</style>
