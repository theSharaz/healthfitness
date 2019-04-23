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
                        location: obj[key].location,
                        creatorId: obj[key].creatorId

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
        createWorkout ({commit, getters, state}, payload) {

            // console.log('tapinda 0 ')
            // console.log({id: firebase.auth().currentUser.uid})
            // console.log('tapinda 1')
            // console.log(state.user.id)
            // console.log('tapinda 2')
            // console.log(getters.user.uid)


            const workout = {
                title: payload.title,
                location: payload.location,
                description: payload.description,
                date: payload.date.toISOString(),
                creatorId: firebase.auth().currentUser.uid
            }
            let imageUrl
            let key
            firebase.database().ref('workouts').push(workout)
            .then((data) => {
                key = data.key
                return key
            })
            .then(key => {
                const filename = payload.image.name
                const ext = filename.slice(filename.lastIndexOf('.'))
                return firebase.storage().ref('workouts/' + key + '' + ext).put(payload.image)
            })
            .then(fileData => {
                imageUrl = fileData.metada.downloadURLs[0]
                return firebase.database().ref('workouts').child(key).update({imageUrl: imageUrl})
            })
            .then(() => {
                commit('createWorkout', {
                    ...workout,
                    imageUrl: imageUrl,
                    id: key
                })
            })
            .catch((error) => {
                console.log(error)
            })
            
        },
        signUserUp ({commit}, payload) {
            commit('setLoading', true)
            commit('clearError')
            firebase.auth().createUserWithEmailAndPassword(payload.email, payload.password)
            .then(
                user => {
                    commit('setLoading', false)
                    const newUser = {
                        id: user.user.uid,
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
                        id: user.user.uid,
                        registeredWorkouts: []
                    }
                    console.log('logged in below 00')
                    console.log(newUser.id)
                    store.commit('setUser', newUser)
                    console.log('logged in below 0')
                    console.log(newUser.id)
                    console.log('logged in below 1')
                    console.log(user.user.uid)
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
        autoSignIn ({commit}, payload) {
            commit('setUser', {id: payload.UID, registeredWorkouts: []})
        },
        logout ({commit}) {
            firebase.auth().signOut()
            commit('setUser', null)
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