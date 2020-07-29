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

export const getEventFilterToken = (tokenId) => {
	return {
		[NEW_PRODUCT]: { tokenId },
		[PRODUCT_SHIPPED]: { tokenId },
		[PRODUCT_RECEIVED]: { tokenId },
		[HANDOVER]: { tokenId }
	}
}

export const getEventName = (event) => {
	return mapEventToString[event.event] || event.event
}
