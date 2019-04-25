<template>

    <v-dialog
        persistent 
        v-model="editDialog"
        width="350px"
        transition="dialog-transition">

        <v-btn fab accent slot="activator">
            <v-icon>edit</v-icon>
        </v-btn>

        <v-card>
            <v-container>
                <v-layout row wrap>
                    <v-flex xs12>
                        <v-card-title>Edit Workout</v-card-title>
                    </v-flex>
                </v-layout>
                <v-divider></v-divider>
                <v-layout row wrap>
                    <v-flex xs12>
                        <v-card-text>
                            <v-text-field 
                            name="title"
                            label="Title"
                            id="title"
                            v-model="editedTitle"                            
                            required>
                            </v-text-field>                        
                            <v-textarea 
                            name="description"
                            label="Description"
                            id="description"
                            v-model="editedDescription"
                            required >
                            </v-textarea>                            
                        </v-card-text> 
                    </v-flex>
                </v-layout>
                <v-divider></v-divider>
                <v-layout row wrap>
                    <v-flex xs12>
                        <v-card-actions>
                            <v-btn flat class="blue--text darken-1" 
                                    @click="editDialog = false">Close</v-btn>
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
    props: ['workout'],
    data () {
        return {
            editDialog: false,
            editedTitle: this.workout.title,
            editedDescription: this.workout.description
        }
    },
    methods: {
        onSaveChanges () {
            if (this.editedTitle.trim() === '' ||  this.editedDescription.trim() === '') {
                return
            }
            this.editDialog = false
            this.$store.dispatch('updateWorkoutData', {
                id: this.workout.id,
                title: this.editedTitle,
                description: this.editedDescription
            })
        }
    }
    
}
</script>