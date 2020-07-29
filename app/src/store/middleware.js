import { EventActions } from '@drizzle/store';
import { toast } from 'react-toastify';

import { addEvent } from './actions'

const TX_ERROR = "TX_ERROR";
const ERROR_CONTRACT_VAR = "ERROR_CONTRACT_VAR";
const TransactionActions = { TX_ERROR, ERROR_CONTRACT_VAR };

let processedEvents = [];

const contractNotifier = _store => next => action => {
  // console.log("event", action.type, action);

  switch(action.type) {
    case EventActions.EVENT_FIRED:
      if (!processedEvents.includes(
          action.event.transactionHash + action.event.event)) {
        console.log("event", action.event);
        processedEvents.push(action.event.transactionHash + action.event.event)
        _store.dispatch(addEvent(action.event, action))
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

      case TransactionActions.ERROR_CONTRACT_VAR:
        /*
        "Internal JSON-RPC error.\n{\n  \"message\": \"VM Exception while processing transaction: revert ERC721Enumerable: owner index out of bounds\",\n  \"code\": -32000,\n  \"data\": {\n    \"0xae35dba9b6062f5827eef46ffd19071c645c9142a47f99ce01168e4a5e22c644\": {\n      \"error\": \"revert\",\n      \"program_counter\": 4802,\n      \"return\": \"0x08c379a00000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000000000000000000002b455243373231456e756d657261626c653a206f776e657220696e646578206f7574206f6620626f756e6473000000000000000000000000000000000000000000\",\n      \"reason\": \"ERC721Enumerable: owner index out of bounds\"\n    },\n    \"stack\": \"c: VM Exception while processing transaction: revert ERC721Enumerable: owner index out of bounds\\n    at Function.c.fromResults (/usr/local/lib/node_modules/ganache-cli/build/ganache-core.node.cli.js:2:160122)\\n    at readyCall (/usr/local/lib/node_modules/ganache-cli/build/ganache-core.node.cli.js:17:120626)\",\n    \"name\": \"c\"\n  }\n}"
        */
        if (action.error.message){
          toast.error(action.error.message, { position: toast.POSITION.TOP_RIGHT })
        }
        break;

    default: break
  }

  return next(action)
}

const appMiddlewares = [ contractNotifier ]

export default appMiddlewares
