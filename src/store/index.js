import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export const store = new Vuex.Store({
    state: {
        loadedWorkouts: [
            {
                imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b7/201812_Dishui_Lake_from_35L_Final_Approach.jpg/1200px-201812_Dishui_Lake_from_35L_Final_Approach.jpg', 
                id: 'ww332',
                date: new Date(),
                description: 'It is going to be fun',
                location: 'Huinan',
                title: 'Workout in Huinan'
            },
            {
                imageUrl: 'http://www.newtowninstitute.org/newtowndata/NTimages/Lingang-130403-1_2.jpg', 
                id: 'ww331', 
                date: new Date(),
                description: 'It is going to be fun',
                location: 'Lingang',
                title: 'Workout in Lingang'
            }
          ],
        user: {
            id: 'Lily',
            registeredWorkouts:['ww331']
        }
    },
    mutations: {
        createWorkout (state, payload) {
            state.loadedWorkouts.push(payload)
        }
    },
    actions: {
        createWorkout ({commit}, payload) {
            const workout = {
                title: payload.title,
                location: payload.location,
                imageUrl: payload.imageUrl,
                description: payload.description,
                date: payload.date,
                id: 'hjhjhk'
            }
            //Reach out to firebase and store it
            commit('createWorkout', workout)
        }
    },
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