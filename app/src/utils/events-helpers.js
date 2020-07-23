import { ZERO_ADDRESS } from './constants';
import { addAllEvents } from '../store/actions'
import store from '../store/store'

export const EVENT_NAMES = [
	"MakerAdded",
	"MakerRemoved",
	"DeliveryManAdded",
	"DeliveryManRemoved",
	"OwnershipTransferred",
	"Transfer",
	"Approval"
]

export const getEventName = (event, account) => {
	let eventName = event.event

	if (eventName === 'Approval') {
		eventName = "Product sent"
		if (event.returnValues.owner === account) {
			eventName += ' by me'
		}
		else if (event.returnValues.approved === account) {
			eventName += ' to me'
		}
	}

	if (eventName === 'Transfer') {
		if (event.returnValues.from === ZERO_ADDRESS) {
			eventName = "Product created"
		}
		else if (event.returnValues.to === ZERO_ADDRESS) {
			eventName = "Product sent to purchaser"
		}
		else {
			eventName = "Product received"
			if (event.returnValues.to === account) {
				eventName += ' by me'
			}
			else if (event.returnValues.from === account) {
				eventName += ' from me'
			}
		}
	}

	return eventName
}

export const getEvents = (web3Contract, eventNames, filters) => {
	eventNames.forEach((eventName, i) => {
		web3Contract.getPastEvents(eventName, {
			fromBlock: 0,
			filter: filters[eventName]
		}).then(events => {
			store.dispatch(addAllEvents(events))
		})
	});
}

export const getBlockTimestamp = (web3, blockNumber) => {
	return web3.eth.getBlock(blockNumber)
	.then(block => {
		let timestamp = new Date(block.timestamp * 1000)
		return timestamp.toUTCString()
	})
}
