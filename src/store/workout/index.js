import * as firebase from 'firebase'

// workout js


export default {
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
          ]
    },
    mutations: {
        setLoadedWorkouts (state, payload) {
            state.loadedWorkouts = payload
        },
        createWorkout (state, payload) {
            state.loadedWorkouts.push(payload)
        },
        updateWorkout (state, payload) {
            const workout = state.loadedWorkouts.find(workout => {
                return workout.id === payload.id
            })
            if (payload.title) {
                workout.title = payload.title
            }
            if (payload.description) {
                workout.description = payload.description
            }
            if (payload.date) {
                workout.date = payload.date
            }

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
                commit('setLoading', false)
                }
            )
        },
        createWorkout ({commit, getters, state}, payload) {

            // console.log('tapinda 0 ')
            // console.log({id: firebase.auth().currentUser.uid})
            // console.log('tapinda 1')
            // console.log(payload.date.toISOString())
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
                let fullPath = fileData.metadata.fullPath
                return firebase.storage().ref(fullPath).getDownloadURL()
              })
            .then(URL => {
                imageUrl = URL
                return firebase.database().ref('workouts').child(key).update({imageUrl: imageUrl})
            })
            .then(() => {
                commit('createWorkout', {
                    ...workout,
                    imageUrl:imageUrl,
                    id: key
                })
            })
            .catch((error) => {
                console.log(error)
            })
            
        },
        updateWorkoutData ({commit}, payload) {
            commit('setLoading', true)
            const updateObj = {}
            if (payload.title) {
                updateObj.title = payload.title
            }
            if (payload.description) {
                updateObj.description = payload.description
            }
            if (payload.date) {
                updateObj.date = payload.date
            }
            firebase.database().ref('workouts').child(payload.id).update(updateObj)
            .then(() => {
                commit('setLoading', false)
                commit('updateWorkout', payload)
            })
            .catch(
                error => {
                    commit('setLoading', false)
                    // commit('setError', error)
                    console.log(error)
                }
            )
            
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
}