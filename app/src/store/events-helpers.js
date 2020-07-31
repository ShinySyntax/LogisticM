import { addAllEvents } from './actions'

import { NEW_PRODUCT,
	PRODUCT_SHIPPED,
	PRODUCT_RECEIVED,
	HANDOVER,
 	mapEventToString } from './constants'

export const getPastEvents = (drizzle, eventNames, filters) => {
	const store = drizzle.store
	const web3 = drizzle.web3;

	const contract = new web3.eth.Contract(
		drizzle.contracts.Logistic.abi,
		drizzle.contracts.Logistic.address
	)

	eventNames.forEach((eventName, i) => {
		contract.getPastEvents(eventName, {
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

export const getEventFilterToken = (productId) => {
	return {
		[NEW_PRODUCT]: { productId },
		[PRODUCT_SHIPPED]: { productId },
		[PRODUCT_RECEIVED]: { productId },
		[HANDOVER]: { productId }
	}
}

export const getEventName = (event) => {
	return mapEventToString[event.event] || event.event
}
