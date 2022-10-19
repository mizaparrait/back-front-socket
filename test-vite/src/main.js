import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import Vuex, { createStore } from 'vuex'
import { io } from 'socket.io-client'
import counterModule from './store/counter'

const store = createStore({
    state: {
        io: {}
    },
    mutations: {
        setSocket: (state, socket) => {
            state.io = socket
            console.log('Socket Conectado')
        }
    },
    modules: {
        counterModule
    }
})

const socket = io('http://localhost:3001', store)

createApp(App)
.use(Vuex)
.use(store)
.mount('#app')

store.commit('setSocket', store.socket)

