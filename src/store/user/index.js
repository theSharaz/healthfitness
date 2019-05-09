import * as firebase from 'firebase'

// user js

export default {
    state: {
        user: null,
        loadedTrainers: [],
        loadedProfiles: []
    },
    mutations: {
        setLoadedTrainers (state, payload) {
            state.loadedTrainers = payload
        },
        setLoadedProfiles (state, payload) {
            state.loadedProfiles = payload
        },
        registerPrivateWorkout (state, payload) {
            state.user.privateWorkouts.push(payload)
        },
        unRegisterPrivateWorkout (state, payload) {
            // const regPvtWorkout = state.user.privateWorkouts
            // registeredWorkouts.splice(registeredWorkouts.findIndex(workout => workout.id === 
            //     payload), 1)
            // Reflect.deleteProperty(state.user.fbKeys, payload)

            state.user.privateWorkouts = null
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
        loadProfiles({commit}) {
            commit('setLoading', true)
            firebase.database().ref('profiles').once('value')
            .then((data) => {
                const profiles = []
                const obj = data.val()
                for (let key in obj) {
                    profiles.push({
                        ...obj[key],
                            id: key
                    })
                }
                commit('setLoadedProfiles', profiles)
                commit('setLoading', false)
            })
            .catch(
                (error) => {
                console.log(error)
                commit('setLoading', false)
                }
            )
        },
        loadTrainers({commit}) {
            commit('setLoading', true)
            let trainers = []
            let trainerProfiles = []

            firebase.database().ref('userType').once('value')
            .then((data) => { 
                const obj = data.val()
                for (let key in obj) {
                    if (obj[key].type === 'trainer') {
                        trainers.push({
                            id: key
                        })
                    }
                }

                // console.log('trainer user type')
                // console.log(trainers)

            })
            .then(() => {
                // console.log("user id after data")
                // console.log(getters.user.id)
                firebase.database().ref('profiles').once('value')
                .then (data => {
                    const obj = data.val()
                    let userprofiles = []

                    for (let key in obj) {
                        userprofiles.push({
                            ...obj[key],
                            id: key
                        })
                        // console.log('TRAINER KEYS')
                        // console.log(key)
                    }

                    for (let key in userprofiles) {
                        // console.log('userprofiles key')
                        // console.log(userprofiles[key])
                        for (let key1 in trainers) {
                            // console.log('trainer key')
                            // console.log(trainers[key1])
                            if (userprofiles[key].id === trainers[key1].id) {
                                trainerProfiles.push(userprofiles[key])
                            }

                        }

                    }
                    // console.log('user profiles')
                    // console.log(userprofiles)
                    // console.log('trainer profiles')
                    // console.log(trainerProfiles)
                    
                    commit('setLoadedTrainers', trainerProfiles)
                    commit('setLoading', false)

                    // console.log('TRAINER PROFILES SET')
                    // console.log(getters.loadedTrainers)

                })

            })
            .catch(
                (error) => {
                console.log(error)
                commit('setLoading', false)
                }
            )
        },
        registerPrivateWorkout ({commit,getters}, payload) {
            commit('setLoading', true)
            const user = getters.user
            firebase.database().ref('/users/' + user.id).child('/privateWorkouts/')
            .update({trainer: payload.trainerid,
                    date: payload.date})
                .then(() => {
                    firebase.database().ref('/users/' + payload.trainerid).child('/privateWorkouts/')
                    .update({client: user.id,
                        date: payload.date})
                    .then(() => {
                        commit('setLoading', false)
                        commit('registerPrivateWorkout', {trainerid: payload.trainerid, date: payload.date})

                    })
                })
                .catch(error => {
                    console.log(error)
                    commit('setLoading', false)
                })
        },
        unRegisterPrivateWorkout ({commit,getters}, payload) {
            commit('setLoading', true)
            const user = getters.user
            if (!user.privateWorkouts) {
                return
            }
            const privateWorkouts = user.privateWorkouts[payload]
            firebase.database().ref('/users/' + user.id + '/privateWorkouts')
                .remove()
                .then(() => {
   
                })
                .then(() => {
                    firebase.database().ref('/users/' + payload  +  '/privateWorkouts/')
                    .remove()
                    .then(() => {
                        commit('setLoading', false)
                        commit('unRegisterPrivateWorkout')
                        // console.log('Trainer id being deleted')
                        // console.log(payload)
                        // console.log('USER AFTER PRIVATE WORKOUT DELETED')
                        // console.log(getters.user)
                    })
                })
                .catch(error => {
                    console.log(error)
                    commit('setLoading', false)
                })
        },
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

                    // console.log('User')
                    // console.log(getters.user)
    
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
                // console.log(theNoob.type)


            })
            .then(() => {

                const user = getters.user
                // console.log('PAYLOAD Type')
                // console.log(payload.type)
                if(payload.type === 'normal' || 'NORMAL') {

                    theNoob = {
                        ...theNoob,
                        membership: 'none'
                    }

                    return firebase.database().ref('membership').child(user.id).update({status: 'none'})
                }
            })
            .then(() => {

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

            // console.log("USER ID BEFORE DATA FETCH")
            // console.log(getters.user.id)

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
                    // console.log("user id after data")
                    // console.log(getters.user.id)

                    firebase.database().ref('/profiles/' + getters.user.id).once
                    ('value')
                        .then (data => {
                            const obj = data.val()
                            let userprofile = obj

                            LeUser = {
                                ...LeUser,
                                profile: userprofile
                            }
                           
                            // console.log("LeUser after profile added")
                            // console.log(LeUser)
        
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
                                type: type.type
                            }

                            // console.log('FULL USER SET AFTER USER TYPE')
                            commit('setUser', LeUser)
                            // console.log(getters.user)
        
                        })  

                })
                .then(() => {
                    firebase.database().ref('/users/' + getters.user.id + '/privateWorkouts').once
                        ('value')
                        .then (data => {
                            const obj = data.val()
                            let pvtworkouts = {
                                ...obj,
                                privateWorkouts: pvtworkouts
                            }
        
                            LeUser = {
                                ...LeUser,
                                privateWorkouts: pvtworkouts
                            }

                            console.log('PVT Workouts SET')
                            commit('setUser', LeUser)
                            console.log(getters.user)
        
                        })

                })
                .then(() => {
                    if(LeUser.type === 'normal' || 'NORMAL') {

                        // console.log('NORMAL USER MEMBERSHIP STATUS')


                        firebase.database().ref('/membership/' + getters.user.id).once
                        ('value')
                            .then (data => {
                                const obj = data.val()
                                let membership = obj
            
                                LeUser = {
                                    ...LeUser,
                                    membership: membership.status
                                }

                                // console.log('FULL USER SET')
                                commit('setUser', LeUser)
                                // console.log(getters.user)

                            })  
                    }


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
            let LeUser = null

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
                LeUser = {
                    ...user,
                    profile: profile
                }

                commit('setLoading', false)
                commit('setUser', LeUser)

                console.log('created profile')
                console.log(getters.user)


            })
            
            .catch((error) => {
                commit('setLoading', false)
                console.log(error)
            })
            
        },
        payForMembership({commit, getters}) {
            commit('setLoading', true)
            const user = getters.user

            firebase.database().ref('membership').child(user.id).update({status: 'paid'})
            .then(() => {

                payingMember = {
                    ...user,
                    membership: 'paid'

                }
                commit('setUser', payingMember)
                commit('setLoading', false)

                // console.log('membership set')
                // console.log(getters.user.membership)
                // console.log('User Type')
                // console.log(theNoob.type)


            })

        },
        updateProfile ({commit, getters}, payload) {
            commit('setLoading', true)
            const user = getters.user
            let LeUser = null

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
                LeUser = {
                    ...user,
                    profile: profile
                }

                commit('setLoading', false)
                commit('setUser', LeUser)

                console.log('profile updated')
                console.log(getters.user)


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
        }, 
        loadedTrainers (state) {
            return state.loadedTrainers
        },
        loadedTrainer (state) {
            return (trainerid) => {
                return state.loadedTrainers.find((trainer) =>{
                    return trainer.id === trainerid
                })
            }
        },
        loadedProfiles (state) {
            return state.loadedProfiles
        },
        loadedProfile (state) {
            return (profileid) => {
                return state.loadedProfiles.find((profile) =>{
                    return profile.id === profileid
                })
            }
        }


    }
}