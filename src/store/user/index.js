import * as firebase from 'firebase'

// user js

export default {
    state: {
        user: null
    },
    mutations: {
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
        signUserUp ({commit, getters}, payload) {
            commit('setLoading', true)
            commit('clearError')
            let theNoob = null
            firebase.auth().createUserWithEmailAndPassword(payload.email, payload.password)
            .then(
                user => {
                    commit('setLoading', false)
                    const newUser = {
                        id: user.user.uid,
                        email: payload.email,
                        registeredWorkouts: [],
                        fbKeys: {}
                    }
                    commit('setUser', newUser)

                    theNoob = {
                        ...newUser
                    }

                    console.log('User')
                    console.log(getters.user)
    
                }
            )
            .then(() => {

                const user = getters.user

                return firebase.database().ref('userType').child(user.id).update({type: payload.type})
            })
            .then(() => {

                theNoob = {
                    ...theNoob,
                    type: payload.type
                }
                // commit('setUserType', payload.type)
                // commit('setLoading', false)

                // console.log('payload Type')
                // console.log(payload.type)
                // console.log('User Type')
                // console.log(getters.user.type)


            })
            .then(() => {

                const user = getters.user
                console.log('PAYLOAD Type')
                console.log(payload.type)
                if(payload.type === 'normal' || 'NORMAL') {
                    return firebase.database().ref('membership').child(user.id).update({status: 'none'})
                }
            })
            .then(() => {


                theNoob = {
                    ...theNoob,
                    membership: none
                }

                commit('setUser', theNoob)
                console.log('the Noob is SET')
                console.log(getters.user)
                commit('setLoading', false)

            })
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
                        email: payload.email,
                        registeredWorkouts: [],
                        fbKeys: {}
                    }
                    // console.log('logged in below 00')
                    // console.log(newUser.id)
                    commit('setUser', newUser)
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
        autoSignIn ({commit,getters}, payload) {
            // console.log('autosignin commit')
            // console.log(payload.email)
            
            const lala = {
                id: payload.uid, 
                email: payload.email,
                registeredWorkouts: [],
                fbKeys: {}
            }
            commit('setUser', lala)

            // console.log('email in lala')
            // console.log(lala.email)

            // console.log('user now has an email')
            // console.log(getters.user.email)

        },
        fetchUserData ({commit, getters}) {
            commit('setLoading', true)
            let LeUser = null
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

                    const updatedUser = {
                        id: getters.user.id,
                        email: getters.user.email,
                        registeredWorkouts: registeredWorkouts,
                        fbKeys: swappedPairs
                    }

                    LeUser = updatedUser

                })
                .then(() => {
                    console.log("user id after data")
                    console.log(getters.user.id)
                    firebase.database().ref('/profiles/' + getters.user.id).once
                    ('value')
                        .then (data => {
                            const obj = data.val()
                            let userprofile = obj

                            LeUser = {
                                ...LeUser,
                                profile: userprofile
                            }
                           
                            console.log("LeUser after profile added")
                            console.log(LeUser)
        
                        })
                })
                .then(() => {
                    firebase.database().ref('/userType/' + getters.user.id).once
                    ('value')
                        .then (data => {
                            const obj = data.val()
                            let type = obj
        
                            LeUser = {
                                ...LeUser,
                                type: type
                            }
        
                        })  

                })
                // .then(() => {
                //     if(LeUser.type === 'normal' || 'NORMAL') {

                //         console.log('NORMAL USER MEMBERSHIP STATUS')


                //         firebase.database().ref('/membership/' + getters.user.id).once
                //         ('value')
                //             .then (data => {
                //                 const obj = data.val()
                //                 let membership = obj
            
                //                 LeUser = {
                //                     ...LeUser,
                //                     membership: membership.membership
                //                 }
                //             })  
                //     }

                // })
                .then(() => {
                    console.log('USER SET')
                    commit('setUser', LeUser)
                    console.log(getters.user)
                    commit('setLoading', false)

    
                })
                .catch(
                    error => {
                        console.log(error)
                        commit('setLoading', false)
                    }
                )

        },
        createProfile ({commit, getters}, payload) {
            commit('setLoading', true)

            const user = getters.user

            // console.log("Create user email from getter")
            // console.log(getters.user.email)

            const profile = {
                name: payload.name,
                phone: payload.phone,
                weight: payload.weight,
                height: payload.height,
                email: getters.user.email,
            }

            // console.log('profile email here')
            // console.log(profile.email)
            
            let imageUrl
            let key
            firebase.database().ref('profiles').child(user.id)
            .update(profile)
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

                profile.imageUrl = imageUrl
                commit('setLoading', false)
                commit('setProfile', profile)

                console.log('created profile')
                console.log(getters.user.profile)


            })
            
            .catch((error) => {
                commit('setLoading', false)
                console.log(error)
            })
            
        },
        updateProfile ({commit, getters}, payload) {
            commit('setLoading', true)
            const user = getters.user

            // console.log("Create user email from getter")
            // console.log(getters.user.email)
            const updateObj = {}
            if (payload.name) {
                updateObj.name = payload.name
            }
            if (payload.phone) {
                updateObj.phone = payload.phone
            }
            if (payload.weight) {
                updateObj.weight = payload.weight
            }
            if (payload.height) {
                updateObj.height = payload.height
            }
            if (payload.image) {
                updateObj.image = payload.image
            }


            const profile = {
                name: updateObj.name,
                phone: updateObj.phone,
                weight: updateObj.weight,
                height: updateObj.height,
                email: getters.user.profile.email,

            }

            // console.log('profile email here')
            // console.log(profile.email)
            
            let imageUrl
            let key
            firebase.database().ref('profiles').child(user.id)
            .update(profile)
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
                profile.imageUrl = imageUrl
         
                // profile.imageUrl = imageUrl
                // const updatedUser = {
                //     id: getters.user.id,
                //     email: getters.user.email,
                //     registeredWorkouts: getters.user.registeredWorkouts,
                //     fbKeys: getters.user.fbKeys,
                //     profile: profile
                // }
                // commit('setUser', updatedUser)
                commit('setLoading', false)
                commit('setProfile', profile)

                console.log('create profile email here')
                console.log(getters.user.profile)


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