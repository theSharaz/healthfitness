<template>

<v-container>

  <v-layout row>
    <v-flex xs12 sm6 offset-sm3>
      <h4>CREATE A NEW WORKOUT</h4>
    </v-flex>
  </v-layout>
  <v-layout row>
    <v-flex xs12>

      <form>
      
        <v-layout>
          <v-flex xs12 sm6 offset-sm3>
            <v-text-field 
            name="title"
            label="Title"
            id="title"
            v-model="title" 
            required>
            </v-text-field>
          </v-flex>
        </v-layout>

        <v-layout>
          <v-flex xs12 sm6 offset-sm3>
            <v-text-field 
            name="location"
            label="Location"
            id="location"
            v-model="location"            
            required >
            </v-text-field>
          </v-flex>
        </v-layout>

        <v-layout>
          <v-flex xs12 sm6 offset-sm3>
            <v-text-field 
            name="imageUrl"
            label="Image URL"
            id="imageUrl"
            v-model="imageUrl"            
            required >
            </v-text-field>          
          </v-flex>
        </v-layout>

        <v-layout>
          <v-flex xs12 sm6 offset-sm3>
            <img :src="imageUrl" height="150">
          </v-flex>
        </v-layout>

        <v-layout>
          <v-flex xs12 sm6 offset-sm3>
            <v-textarea 
            name="description"
            label="Description"
            id="description"
            v-model="description"
            required >
            </v-textarea>
          </v-flex>
        </v-layout>  

        <v-layout>
          <v-flex xs12 sm6 offset-sm3>
            <h4>Choose  a Date and Time</h4>
          </v-flex>
        </v-layout>   
        <v-layout>
          <v-flex xs12 sm6 offset-sm3 class="mb-2">
            <v-date-picker v-model="date"></v-date-picker>
           </v-flex>
        </v-layout>      
        <v-layout>
          <v-flex xs12 sm6 offset-sm3>
            <v-time-picker v-model="time" format="24hr"></v-time-picker>
         </v-flex>
        </v-layout>         

      </form>

    </v-flex>
  </v-layout>
 
  <v-layout row>
    <v-flex xs12 sm6 offset-sm3>
      <v-btn 
      class="primary" 
      :disabled="!formIsValid"
      @click="onCreateWorkout"
      type="submit">Create Workout</v-btn>
    </v-flex>
  </v-layout>

</v-container>

</template>

<script>

  export default {

    data () {
      return {
        title: '',
        location: '',
        imageUrl: '',
        description: '',
        date: new Date().toISOString().substr(0, 10),
        time: ''
      }
    },

    computed: {
      formIsValid () {
        return this.title !== '' 
        && this.location !== '' 
        && this.imageUrl !== '' 
        && this.description !== ''
        
      },
      submittableDateTime () {
        const date = new Date(this.date)
        date.setHours(this.time.substr(0, 2),this.time.substr(3, 5))
        console.log(date)
        return date
      }
    },
    
    methods: {
      onCreateWorkout () {
          if (!this.formIsValid) {
            return 
          }        
        const workoutData = {
          title: this.title,
          location: this.location,
          imageUrl: this.imageUrl,
          description: this.description,
          date: this.submittableDateTime,          
        }
        this.$store.dispatch('createWorkout', workoutData)
        this.$router.push('/gw')
      }
    }

  }

</script>

<style>

</style>
