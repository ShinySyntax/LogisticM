import { generateStore } from '@drizzle/store'

import drizzleOptions from './drizzleOptions'
import appMiddlewares from './middleware'

// create the store
export default generateStore({
  drizzleOptions,
  appMiddlewares,
  disableReduxDevTools: false  // enable ReduxDevTools!
})
