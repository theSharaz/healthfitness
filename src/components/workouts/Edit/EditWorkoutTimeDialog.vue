<template>

    <v-dialog
        persistent 
        v-model="editDialog"
        width="350px">

        <v-btn accent slot="activator">
            Edit Time
        </v-btn>

        <v-card>
            <v-container>

                <v-layout row wrap>
                    <v-flex xs12>
                        <v-card-title>Edit Workout Time</v-card-title>
                    </v-flex>
                </v-layout>
                <v-divider></v-divider>
                <v-layout row wrap>
                    <v-flex xs12>
                        <v-time-picker 
                        v-model="editableTime"
                         style="width: 100%" 
                         actions
                         format="24hr">
                            <template scope="{save, cancel}">
                                <v-btn 
                                class="blue--text darken-1" 
                                flat 
                                @click.native="editDialog = false">Close</v-btn>
                                <v-btn 
                                class="blue--text darken-1" 
                                flat 
                                @click.native="onSaveChanges">Save</v-btn>   
                             </template>                          
                        </v-time-picker>
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
            editableTime: null
        }
    },
    methods: {
        onSaveChanges () {
            const newDate = new Date(this.workout.date)
            newDate.setHours(this.editableTime.substr(0, 2),this.editableTime.substr(3, 5))
            console.log('new time')        
            console.log(newDate)

            this.$store.dispatch('updateWorkoutData',{
                id: this.workout.id,
                date: newDate
            })

        }
    },
    created () {
        // this.editableTime = new Date(this.workout.date).toTimeString()
        let date = new Date(this.workout.date);
        let hours = date.getUTCHours();
        let minutes = date.getUTCMinutes();
        this.editableTime = hours + ":" + minutes;
        console.log('current time')        
        console.log(this.workout.date)
    }
}
</script>