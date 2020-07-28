import { generateStore } from '@drizzle/store'

import drizzleOptions from './drizzleOptions'
import appMiddlewares from './middleware'
import { eventsReducer } from "./reducers"

// create the store
export default generateStore({
  drizzleOptions,
  appMiddlewares,
  appReducers: { events: eventsReducer },
  disableReduxDevTools: false  // enable ReduxDevTools!
})
