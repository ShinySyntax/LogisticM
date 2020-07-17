import { createStore } from 'redux'
import eventApp from './reducers'

const store = createStore(eventApp)

export default store
