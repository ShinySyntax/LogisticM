import { generateStore } from '@drizzle/store'

import appMiddlewares from './middleware'
import { eventsReducer } from "./reducers"

export default function getStore(drizzleOptions) {
    return generateStore({
      drizzleOptions,
      appMiddlewares,
      appReducers: { events: eventsReducer },
      disableReduxDevTools: false  // enable ReduxDevTools!
    })
}
