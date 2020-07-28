import {
  ADD_EVENT,
  ADD_ALL_EVENTS
} from './actions'

const initialState = {
  events: []
}

export function eventsReducer(state = initialState, action) {
  switch (action.type) {
    case ADD_EVENT:
      return Object.assign({}, state, {
        events: [action.event, ...state.events]
      })
    case ADD_ALL_EVENTS:
      return Object.assign({}, state, {
        events: [...state.events, ...action.events]
        .filter((event, idx, self) => {
          return self.findIndex(ev => {
            return ev.transactionHash === event.transactionHash &&
            ev.event === event.event
          }) === idx
        })
        .sort((a, b) => {
          return b.blockNumber - a.blockNumber
        })
      })
    default:
      return state
  }
}
