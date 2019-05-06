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

            <v-btn 
            raised 
            class="primary" 
            @click="onPickFile">
            Upload Image
            </v-btn>
            <input 
            type="file" 
            style="display: none" 
            ref="fileInput" 
            accept="image/*"
            @change="onFilePicked">

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
      v-if="userIsAuthenticated && !this.userIsNormal"
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
        time: '',
        image: null
        
      }
    },

    computed: {
      user () {
        return this.$store.getters.user
      },      
      formIsValid () {
        return this.title !== '' 
        && this.location !== '' 
        && this.imageUrl !== '' 
        && this.description !== ''
        
      },
      submittableDateTime () {
        const date = new Date(this.date)
        date.setHours(this.time.substr(0, 2),this.time.substr(3, 5))
        return date
      },
      userIsAuthenticated () {
        return this.$store.getters.user !== null && this.$store.getters.user !== undefined
      },
      userIsNormal () {
        return this.$store.getters.user.type === 'normal' || this.$store.getters.user.type === 'NORMAL'
      }
    },
    
    methods: {
      onCreateWorkout () {

        // console.log('submittable time')
        // console.log(this.submittableDateTime)

          if (!this.formIsValid) {
            return 
          }  
          if (!this.image) {
            return 
          }                  
        const workoutData = {
          title: this.title,
          location: this.location,
          image: this.image,
          description: this.description,
          date: this.submittableDateTime
        }
        this.$store.dispatch('createWorkout', workoutData)
        this.$router.push('/gw')
      },
      onPickFile() {
        this.$refs.fileInput.click()
      },
      onFilePicked (event) {
        const files = event.target.files
        let filename = files[0].name
        if (filename.lastIndexOf('.') <= 0) {
          return alert('Please add a valid image!')
        }
        const fileReader = new FileReader()
        fileReader.addEventListener('load', () => {
          this.imageUrl = fileReader.result
        })
        fileReader.readAsDataURL(files[0])
        this.image = files[0]
      }
    }

  }

</script>

<style>

</style>
