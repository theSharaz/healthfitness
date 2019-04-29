<template >

    <v-dialog
        persistent 
        v-model="profDialog"
        width="600px"
        transition="dialog-transition">

        <v-btn color="secondary" dark slot="activator" >
            <v-icon left dark>edit</v-icon> Create Profile
        </v-btn>

        <v-card>
            <v-container>
                <v-layout row wrap>
                    <v-flex xs12>
                        <v-card-title>
                            <span class="headline">User Profile</span>
                        </v-card-title>                    
                    </v-flex>
                </v-layout>

                <v-divider></v-divider>

                <v-container grid-list-md>
                    <v-layout wrap>
                    <v-flex xs12>
                        <v-text-field 
                        name="name"
                        label="Name"
                        id="name"
                        v-model="name" 
                        required>
                        </v-text-field>
                    </v-flex>
                    
                    <v-flex xs12>
                        <v-text-field 
                        v-model="height"
                        name="height"
                        maxlength="3"
                        :rules="[rules.number, rules.length(1)]"
                        label="Height"
                        class="form-control"
                        required>
                        </v-text-field>
                    </v-flex>

                    <v-flex xs12>
                        <v-text-field 
                        v-model="weight"
                        name="weight"
                        maxlength="3"
                        label="Weight"
                        :rules="[rules.number, rules.length(1)]"
                        required>
                        </v-text-field>
                    </v-flex>

                    <v-flex xs12>

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

                    <v-flex xs12>
                    <img :src="imageUrl" height="150">
                    </v-flex>

                    <v-flex xs12>
                        <v-text-field
                        v-model="phone"
                        box
                        color="deep-purple"
                        label="Phone number"
                        mask="phone"
                    ></v-text-field>
                    </v-flex>

                    </v-layout>
                </v-container>
                
                <v-divider></v-divider>

                <v-layout row wrap>
                    <v-flex xs12>
                        <v-card-actions>
                            <v-btn flat class="blue--text darken-1" 
                                    @click="profDialog = false">Close</v-btn>
                            <v-btn flat class="blue--text darken-1" :disabled="!formIsValid" @click="onCreateProf">Save</v-btn>
                        </v-card-actions>
                    </v-flex>
                </v-layout>
            </v-container>
        </v-card>

    </v-dialog>

</template>


<script>

  export default {

    data () {
      return {
        name: '',
        phone: '',
        imageUrl: '',
        weight: '',
        height: '',
        image: null,
        profDialog: false,
        rules: {     
        length: len => v => (v || '').length >= len || `Invalid character length, required ${len}`,  
        number: v => (v || '').match(/^(?=.*[1-9])/) ||
          'Please only enter three digit numbers'
      }

        
      }
    },

    computed: {
      user () {
        return this.$store.getters.user
      },      
      formIsValid () {
        return this.name !== '' 
        && this.weight !== '' 
        && this.height !== ''
        && this.imageUrl !== '' 
        && this.phone !== '' 
        
      }
    },
    
    methods: {
      onCreateProf () {

          if (!this.formIsValid) {
            return 
          }  
          if (!this.image) {
            return 
          }                  
        // const profileData = {
        //   name: this.name,
        //   phone: this.phone,
        //   image: this.image,
        //   weight: this.weight,
        //   height: this.height
        // }
        // this.$store.dispatch('createProfile', profileData)
        // this.$router.push('/prof')
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
