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
      return Object.assign({}, state, {
        events: [action.event, ...state.events]
      })
    case ADD_ALL_EVENTS:
      return Object.assign({}, state, {
        events: [...state.events, ...action.events].sort((a, b) => {
          return b.blockNumber - a.blockNumber
        })
      })
    default:
      return state
  }
}

const eventApp = combineReducers({
	eventsReducer: events
})

export default eventApp
