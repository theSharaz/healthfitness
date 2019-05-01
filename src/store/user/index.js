import * as firebase from 'firebase'

// user js

export default {
    state: {
        user: null
    },
    mutations: {
        createProfile (state, payload) {
            const id = payload.id
            //security to make sure no double registrations
            // if(state.user.profile.findIndex(workout => workout.id === id) >= 0) {
            //     return
            // }
            state.user.profile.push(payload)
            
        },
        registerUserForWorkout (state, payload) {
            const id = payload.id
            //security to make sure no double registrations
            if(state.user.registeredWorkouts.findIndex(workout => workout.id === id) >= 0) {
                return
            }
            state.user.registeredWorkouts.push(id)
            state.user.fbKeys[id] = payload.fbKey
        },
        unRegisterUserFromWorkout (state, payload) {
            const registeredWorkouts = state.user.registeredWorkouts
            registeredWorkouts.splice(registeredWorkouts.findIndex(workout => workout.id === 
                payload), 1)
            Reflect.deleteProperty(state.user.fbKeys, payload)
        },
        setUser (state, payload) {
            state.user = payload
        }
    },
    actions: {
        registerUserForWorkout ({commit,getters}, payload) {
            commit('setLoading', true)
            const user = getters.user
            firebase.database().ref('/users/' + user.id).child('/registrations/')
                .push(payload)
                .then(data => {
                    commit('setLoading', false)
                    commit('registerUserForWorkout', {id: payload, fbKey: data.key})
                })
                .catch(error => {
                    console.log(error)
                    commit('setLoading', false)
                })
        },
        unRegisterUserFromWorkout ({commit,getters}, payload) {
            commit('setLoading', true)
            const user = getters.user
            if (!user.fbKeys) {
                return
            }
            const fbKey = user.fbKeys[payload]
            firebase.database().ref('/users/' + user.id + '/registrations').child(fbKey)
                .remove()
                .then(() => {
                    commit('setLoading', false)
                    commit('unRegisterUserFromWorkout', payload)
                })
                .catch(error => {
                    console.log(error)
                    commit('setLoading', false)
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
                        registeredWorkouts: [],
                        fbKeys: {}
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
                        registeredWorkouts: [],
                        fbKeys: {}
                    }
                    // console.log('logged in below 00')
                    // console.log(newUser.id)
                    store.commit('setUser', newUser)
                    // console.log('id from store')
                    // console.log(store.getters.user.id)
                    // console.log('logged in below 1')
                    // console.log(user.user.uid)
                    
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
            // console.log('store commit')
            // console.log(payload.uid)
            commit('setUser', {
                id: payload.uid, 
                registeredWorkouts: [],
                fbKeys: {}
            })
        },
        fetchUserData ({commit, getters}) {
            commit('setLoading', true)
            firebase.database().ref('/users/' + getters.user.id + '/registrations').once
            ('value')
                .then (data => {
                    const dataPairs = data.val()
                    let registeredWorkouts = []
                    let swappedPairs = {}
                    for (let key in dataPairs) {
                        registeredWorkouts.push(dataPairs[key])
                        swappedPairs[dataPairs[key]] = key
                    }
                    // console.log("registeredWorkouts displayed here")
                    // console.log(registeredWorkouts)
                    // console.log("swappedPairs displayed here")
                    // console.log(swappedPairs)

                    const updatedUser = {
                        id: getters.user.id,
                        registeredWorkouts: registeredWorkouts,
                        fbKeys: swappedPairs
                    }
                    commit('setLoading', false)
                    commit('setUser', updatedUser)
                })
                .catch(
                    error => {
                        console.log(error)
                        commit('setLoading', false)
                    }
                )

        },
        createProfile ({commit, getters}, payload) {
            const user = getters.user
            const profile = {
                name: payload.name,
                phone: payload.phone,
                weight: payload.weight,
                height: payload.height,
            }

            
            let imageUrl
            let key
            firebase.database().ref('profiles').child(user.id)
            .update(payload)
            .then((data) => {
                const filename = payload.image.name
                const ext = filename.slice(filename.lastIndexOf('.'))
                return firebase.storage().ref('profiles/' + user.id + '' + ext).put(payload.image)
            })
            .then(fileData => {
                let fullPath = fileData.metadata.fullPath
                return firebase.storage().ref(fullPath).getDownloadURL()
              })
            .then(URL => {
                imageUrl = URL
                return firebase.database().ref('profiles').child(user.id).update({imageUrl: imageUrl})
            })
            .then(() => {
                commit('createProfile', {
                    ...profile,
                    imageUrl:imageUrl,
                    id: user.id
                })
            })
            
            .catch((error) => {
                console.log(error)
            })
            
        },
        logout ({commit}) {
            firebase.auth().signOut()
            commit('setUser', null)
        }
    },
    getters: {
        user (state) {
            return state.user
        }
    }
}