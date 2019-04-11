import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export const store = new Vuex.Store({
    state: {
        loadedWorkouts: [
            {imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b7/201812_Dishui_Lake_from_35L_Final_Approach.jpg/1200px-201812_Dishui_Lake_from_35L_Final_Approach.jpg', 
            id: 'ww332',
            date: '2019-04-20',
            title: 'Workout in Huinan'},
            {imageUrl: 'http://www.newtowninstitute.org/newtowndata/NTimages/Lingang-130403-1_2.jpg', 
            id: 'ww331', 
            date: '2019-04-18',
            title: 'Workout in Lingang'}
          ],
        user: {
            id: 'Lily',
            registeredWorkouts:['ww331']
        }
    },
    mutations: {},
    actions: {},
    getters: {
        loadedWorkouts (state) {
            return state.loadedWorkouts.sort((workoutA, workoutB) =>{
                return workoutA.date > workoutB.date
            })
        },
        featuredWorkouts(state, getters) {
            return getters.loadedWorkouts.slice(0,5)
        },
        loadedWorkout (state) {
            return (workoutid) => {
                return state.loadedWorkouts.find((workout) =>{
                    return workout.id === workoutid
                })
            }
        }
    }
})