import Vue from 'vue'
import Vuex from 'vuex'

import workout from './workout'
import user from './user'
import shared from './shared'

Vue.use(Vuex)

export const store = new Vuex.Store({
    modules: {
        workout: workout,
        user: user,
        shared: shared
    }
})