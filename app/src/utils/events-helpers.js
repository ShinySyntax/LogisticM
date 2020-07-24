import { addAllEvents } from '../store/actions'
import store from '../store/store'

export const getPastEvents = (web3Contract, eventNames, filters) => {
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
