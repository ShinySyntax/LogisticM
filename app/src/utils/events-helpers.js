import { addAllEvents } from '../store/actions'
import store from '../store/store'

import { NEW_ITEM,
	PRODUCT_SHIPPED,
	PRODUCT_RECEIVED } from './constants'

export const getPastEvents = (drizzle, eventNames, filters) => {
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
		[NEW_ITEM]: { tokenId },
		[PRODUCT_SHIPPED]: { tokenId },
		[PRODUCT_RECEIVED]: { tokenId },
	}
}
