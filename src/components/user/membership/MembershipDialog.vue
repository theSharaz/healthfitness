<template>

    <v-dialog width="350px" persistent v-model="paymentDialog">

        <v-btn class="primary" accent slot="activator">
            {{ userIsMember ? 'Refund' : 'Pay for Membership' }}
        </v-btn>

        <v-card>
            <v-container grid-list-md>

            <v-layout row v-if="error">
                <v-flex xs12 sm6 offset-sm3>
                <app-alert @dismissed="onDismissed" :text="error.message"></app-alert>
                </v-flex>
            </v-layout>

                <v-layout row wrap>
                    <v-flex xs12>
                        <v-card-title class="h2" v-if="userIsMember">Refund</v-card-title>
                        <v-card-title class="h2" v-else="!userIsMember">Pay for Membership</v-card-title>
                  </v-flex>
                </v-layout>

                <v-divider></v-divider>
                    <v-layout wrap>
                        <v-flex xs12>
                            <v-text-field 
                            name="code"
                            label="Payment Code"
                            id="code"
                            v-model="code" 
                            required>
                            </v-text-field>
                        </v-flex>
                    </v-layout>


                <v-layout row wrap>
                    <v-flex xs12>
                        <v-card-actions>
                        <v-btn class="red--text darken-1" flat @click="paymentDialog = false">Cancel</v-btn>
                        <v-btn class="green--text darken-1" flat @click="onAgree">Confirm</v-btn>
                        </v-card-actions>
                    </v-flex>
                </v-layout>
 
            </v-container>
        </v-card>

    </v-dialog>

</template>

<script>
export default {
    props: ['workoutId'],
    data () {
        return {
            paymentDialog:  false,
            code: null
        }
    },
    computed: {
        userIsMember () {
            return this.$store.getters.user.membership === 'paid'
        },
        error () {
        return this.$store.getters.error
      }

    },
    methods: {
        onAgree () {
            if (this.code !== null) {
                if(this.code == '123456789'){
                    this.$store.dispatch('payForMembership')
                }
            }
        },
      onDismissed () {
        this.$store.dispatch('clearError')
      }

    }
}
</script>