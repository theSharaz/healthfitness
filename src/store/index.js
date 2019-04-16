import Vue from 'vue'
import Vuex from 'vuex'
import * as firebase from 'firebase'


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
                imageUrl: 'c', 
                id: 'ww331', 
                date: new Date(),
                description: 'It is going to be fun',
                location: 'Lingang',
                title: 'Workout in Lingang'
            }
          ],
        user: null,
        loading: false,
        error: null
    },
    mutations: {
        setLoadedWorkouts (state, payload) {
            state.loadedWorkouts = payload
        },
        createWorkout (state, payload) {
            state.loadedWorkouts.push(payload)
        },
        setUser (state, payload) {
            state.user = payload
        },
        setLoading (state, payload) {
            state.loading = payload
        },
        setError (state, payload) {
            state.error = payload
        },
        clearError (state) {
            state.error = null
        }
    },
    actions: {
        loadWorkouts({commit}) {
            commit('setLoading', true)
            firebase.database().ref('workouts').once('value')
            .then((data) => {
                const workouts = []
                const obj = data.val()
                for (let key in obj) {
                    workouts.push({
                        id: key,
                        title: obj[key].title,
                        description: obj[key].description,
                        imageUrl: obj[key].imageUrl,
                        date: obj[key].date,
                        location: obj[key].location

                    })
                }
                commit('setLoadedWorkouts', workouts)
                commit('setLoading', false)
            })
            .catch(
                (error) => {
                console.log(error)
                commit('setLoading', true)
                }
            )
        },
        createWorkout ({commit}, payload) {
            const workout = {
                title: payload.title,
                location: payload.location,
                imageUrl: payload.imageUrl,
                description: payload.description,
                date: payload.date.toISOString()
            }
            firebase.database().ref('workouts').push(workout)
            .then((data) => {
                const key = data.key
                commit('createWorkout', {
                    ...workout,
                    id: key
                })
            })
            .catch((error) => {
                console.log(error)
            })
            //Reach out to firebase and store it
            
        },
        signUserUp ({commit}, payload) {
            commit('setLoading', true)
            commit('clearError')
            firebase.auth().createUserWithEmailAndPassword(payload.email, payload.password)
            .then(
                user => {
                    commit('setLoading', false)
                    const newUser = {
                        id: user.UID,
                        registeredWorkouts: []
                    }
                    commit('setUser', newUser)
                }
            )
            .catch(
                error => {
                    commit('setLoading', false)
                    commit('setError', error)
                    console.log(error)
                }
            )
        },
        signUserIn ({commit}, payload) {
            commit('setLoading', true)
            commit('clearError')
            firebase.auth().signInWithEmailAndPassword(payload.email, payload.password)
            .then(
                user => {
                    commit('setLoading', false)
                    const newUser = {
                        id: user.UID,
                        registeredWorkouts: []
                    }
                    commit('setUser', newUser)
                }
            )
            .catch(
                error => {
                    commit('setLoading', false)
                    commit('setError', error)
                    console.log(error)
                }
            )            
        },
        clearError ({commit}) {
            commit('clearError')
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
        },
        user (state) {
            return state.user
        },
        error (state) {
            return state.error
        },
        loading (state) {
            return state.loading
        }
    }
})