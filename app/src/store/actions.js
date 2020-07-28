import { getEventName } from './events-helpers'
import { toast } from 'react-toastify';

export const ADD_EVENT = 'ADD_EVENT'
export const ADD_ALL_EVENTS = 'ADD_ALL_EVENTS'

export function addEvent(event, action) {
  event.eventName = getEventName(event)
  toast.success(`${action.event.eventName}`)
  return { type: ADD_EVENT, event }
}

export function addAllEvents(events) {
  events = events.map(event => {
    event.eventName = getEventName(event)
    return event
  })
  return { type: ADD_ALL_EVENTS, events }
}
