import { combineReducers } from 'redux'

import {
  ADD_EVENT,
  ADD_ALL_EVENTS
} from './actions'

const initialState = {
  events: []
}

function events(state = initialState, action) {
  switch (action.type) {
    case ADD_EVENT:
    console.log(15, state);
      return Object.assign({}, state, {
        events: [...state.events, action.event]
      })
    case ADD_ALL_EVENTS:
    console.log(20, state, action.events);
      let newEvents = [...state.events, ...action.events]
      newEvents = newEvents.sort((a, b) => {
        return b.blockNumber - a.blockNumber
      })
      return Object.assign({}, state, {
        events: newEvents
      })
    default:
      console.log(state);
      return state
  }
}

const eventApp = combineReducers({
	eventsReducer: events
})

export default eventApp
