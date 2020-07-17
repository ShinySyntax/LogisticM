export const ADD_EVENT = 'ADD_EVENT'
export const ADD_ALL_EVENTS = 'ADD_ALL_EVENTS'

export function addEvent(event) {
  return { type: ADD_EVENT, event }
}

export function addAllEvents(events) {
  return { type: ADD_ALL_EVENTS, events }
}
