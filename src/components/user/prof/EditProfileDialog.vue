<template >

    <v-dialog
        persistent 
        v-model="profEditDialog"
        width="350px"
        transition="dialog-transition">

        <v-btn color="secondary" dark slot="activator" >
            <v-icon left dark>edit</v-icon> Edit Profile
        </v-btn>

        <v-card>
            <v-container>
                <v-layout row wrap>
                    <v-flex xs12>
                        <v-card-title>
                            <span class="headline">Update User Profile</span>
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
                        v-model="editedName" 
                        required>
                        </v-text-field>
                    </v-flex>
                    
                    <v-flex xs12>
                        <v-text-field 
                        v-model="editedHeight"
                        name="height"
                        maxlength="3"
                        :rules="[rules.number]"
                        label="Height"
                        class="form-control"
                        required>
                        </v-text-field>
                    </v-flex>

                    <v-flex xs12>
                        <v-text-field 
                        v-model="editedWeight"
                        name="weight"
                        maxlength="3"
                        label="Weight"
                        :rules="[rules.number]"
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
                    <img :src="editedImageUrl" height="150">
                    </v-flex>

                    <v-flex xs12>
                        <v-text-field
                        v-model="editedPhone"
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
                                    @click="profEditDialog = false">Close</v-btn>
                            <v-btn flat class="blue--text darken-1" @click="onSaveChanges">Save</v-btn>
                        </v-card-actions>
                    </v-flex>
                </v-layout>
            </v-container>
        </v-card>

    </v-dialog>

</template>


<script>

  export default {
    props: ['profile'],
    data () {
      return {
        editedName: this.profile.name,
        editedPhone: this.profile.phone,
        editedImageUrl: this.profile.imageUrl,
        editedWeight: this.profile.weight,
        editedHeight: this.profile.height,
        image: null,
        profEditDialog: false,
        rules: {     
        length: len => v => (v || '').length >= len || `Invalid character length, required ${len}`,  
        number: v => (v || '').match(/^(?=.*[1-9])/) ||
          'Please only enter three digit numbers'
      }

        
      }
    },
    
    methods: {
      onSaveChanges () {

            if (this.editedName.trim() === '' ||  
                this.editedPhone.trim() === '' ||  
                this.editedImageUrl.trim() === '' ||  
                this.editedWeight.trim() === '' ||  
                this.editedHeight.trim() === '') {
                return
            }          
          this.profEditDialog = false

        const profileData = {
          name: this.editedName,
          phone: this.editedPhone,
          image: this.image,
          weight: this.editedWeight,
          height: this.editedHeight
        }
        this.$store.dispatch('updateProfile', profileData)
        this.$router.push('/prof')
        this.$store.dispatch('fetchUserData')

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
