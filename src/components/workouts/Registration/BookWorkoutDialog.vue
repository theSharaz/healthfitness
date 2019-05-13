<template>

    <v-dialog
    persistent 
    v-model="bookDialog"
    width="800px"
    transition="dialog-transition">


    <v-btn xs5 sm4 :style="{ width: myWidth + 'px' }"  width="100px" color="primary" light slot="activator" >
        <v-icon  >edit</v-icon> Book Workout
    </v-btn>



    <v-card>
        <v-container>

            <v-layout row wrap xs12>
                <v-flex xs12 offset-sm1>
                    <v-card-title><h3>Book Workout with {{trainer.name}}</h3></v-card-title>
                </v-flex>
            </v-layout>

            <v-divider></v-divider>

            <v-layout row wrap xs6>
                <v-flex
                    xs12>
                    <v-card
                    dark
                    color="green darken-3">
                    <v-card-text>
                        <v-date-picker 
                        v-model="bookDate"
                            style="width: 100%" actions
                            >
                                
                        </v-date-picker>

                    </v-card-text>
                    </v-card>
                </v-flex>
                            </v-layout>

            <v-divider></v-divider>
            <v-layout row wrap xs6>

                <v-flex
                    xs12>
                    <v-card
                    dark
                    color="green darken-1">
                    <v-card-text>
                        <v-time-picker 
                            v-model="bookTime"
                            style="width: 100%" 
                            actions
                            format="24hr">                          
                        </v-time-picker>
                    </v-card-text>
                    </v-card>
                </v-flex>
            </v-layout>

            <v-layout row wrap>
                <v-flex xs6>
                    <v-card-actions>
                    <v-btn class="red--text darken-1" flat @click="bookDialog = false">Cancel</v-btn>
                    <v-btn class="green--text darken-1" flat @click="onBookTime">Confirm</v-btn>
                    </v-card-actions>
                </v-flex>
            </v-layout>
 
            </v-container>
        </v-card>

    </v-dialog>

</template>

<script>
export default {
       props: ['trainerid'],
    data () {
        return {
            bookDialog: false,
            bookDate: null,
            bookTime: null,
            date: new Date(),
            myWidth: '200'

        }
    },
    computed: {
      trainer () {
                      console.log('Loaded TRAINER')
            console.log(this.$store.getters.loadedTrainer(this.trainerid))
        return this.$store.getters.loadedTrainer(this.trainerid)
      }
    },
    methods: {
        onBookTime () {

            const newDate = new Date()
            const newDay =  new Date(this.bookDate).getUTCDate()
            const newMonth =  new Date(this.bookDate).getUTCMonth()
            const newYear =  new Date(this.bookDate).getUTCFullYear()
            newDate.setUTCDate(newDay)
            newDate.setUTCMonth(newMonth)
            newDate.setUTCFullYear(newYear)
            newDate.setHours(this.bookTime.substr(0, 2),this.bookTime.substr(3, 5))

                    console.log('new date')        
                    console.log(newDate)

            this.$store.dispatch('registerPrivateWorkout',{
                trainerid: this.trainerid,
                date: newDate
            })
            this.$store.dispatch('fetchUserData')


        }
    },
    created () {

        let date = new Date(this.date)
        let day = date.getUTCDate()
        let month = date.getUTCMonth()+1
        let year = date.getUTCFullYear()
        let hours = date.getUTCHours();
        let minutes = date.getUTCMinutes();

        this.bookTime = hours + ":" + minutes;
        this.bookDate = year+"-"+month+"-"+day

        // console.log('Time')        
        // console.log(this.bookTime)
        // console.log('Date')        
        // console.log(this.bookDate)
    }
}
</script>