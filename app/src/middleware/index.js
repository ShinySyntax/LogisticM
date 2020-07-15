import { EventActions } from '@drizzle/store';
// import * as TransactionActions from '@drizzle/store/transactions/constants';
import { toast } from 'react-toastify';

const TX_ERROR = "TX_ERROR";
const TransactionActions = { TX_ERROR };

console.log(TransactionActions.TX_ERROR);

let events = [];

const contractNotifier = store => next => action => {
  console.log("event", action.type, action);
  // console.log("event", action.type);

  switch(action.type) {
    case EventActions.EVENT_FIRED:
      if (!events.includes(action.event.blockHash)) {
        const contract = action.name
        const contractEvent = action.event.event
        const display = `${contract}: ${contractEvent}`

        toast.success(display, { position: toast.POSITION.TOP_RIGHT })
        events.push(action.event.blockHash)
      }
      break;

    case TransactionActions.TX_ERROR:
      // let message = action.error.message;
      // let reasonIndex = message.indexOf('revert')
      // if (reasonIndex >= 0) {
      //   let reason = message.substring(reasonIndex + 7)
      //   toast.error(reason, { position: toast.POSITION.TOP_RIGHT })
      // }
      if (action.error.message){
        toast.error(action.error.message, { position: toast.POSITION.TOP_RIGHT })
      }
      break;
  }

  return next(action)
}

const appMiddlewares = [ contractNotifier ]

export default appMiddlewares
