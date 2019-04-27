<template>

    <v-dialog
        persistent 
        v-model="editDialog"
        width="350px">

        <v-btn accent slot="activator">
            Edit Date
        </v-btn>

        <v-card>
            <v-container>

                <v-layout row wrap>
                    <v-flex xs12>
                        <v-card-title>Edit Workout Date</v-card-title>
                    </v-flex>
                </v-layout>

                <v-divider></v-divider>

                <v-layout row wrap>
                    <v-flex xs12>
                        <v-date-picker 
                        v-model="editableDate"
                         style="width: 100%" actions
                         >
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
                        </v-date-picker>
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
            editableDate: null
        }
    },
    methods: {
        onSaveChanges () {
            const newDate = new Date(this.workout.date)
            const newDay =  new Date(this.editableDate).getUTCDate()
            const newMonth =  new Date(this.editableDate).getUTCMonth()
            const newYear =  new Date(this.editableDate).getUTCFullYear()
            newDate.setUTCDate(newDay)
            newDate.setUTCMonth(newMonth)
            newDate.setUTCFullYear(newYear)
                    // console.log('new date')        
                    // console.log(newDate)
            this.$store.dispatch('updateWorkoutData',{
                id: this.workout.id,
                date: newDate
            })

        }
    },
    created () {

        let date = new Date(this.workout.date)
        let day = date.getUTCDate()
        let month = date.getUTCMonth()+1
        let year = date.getUTCFullYear()

        this.editableDate = year+"-"+month+"-"+day

        // console.log('editable date')        
        // console.log(this.editableDate)
    }
}
</script>