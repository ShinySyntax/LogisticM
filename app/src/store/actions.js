import { getEventName } from './helpers'
import { toast } from 'react-toastify';

export const ADD_EVENT = 'ADD_EVENT'
export const ADD_ALL_EVENTS = 'ADD_ALL_EVENTS'

export function addEvent(event, action, account) {
  event.eventName = getEventName(event, account)
  toast.success(`${action.name}: ${action.event.eventName}`)
  return { type: ADD_EVENT, event }
}

export function addAllEvents(events, account) {
  events = events.map(event => {
    event.eventName = getEventName(event, account)
    return event
  })
  return { type: ADD_ALL_EVENTS, events }
}
