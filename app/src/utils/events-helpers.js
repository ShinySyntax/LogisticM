import { ZERO_ADDRESS } from '../utils/constants';

const getEventName = (event, account) => {
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
			eventName = "Product sent to buyer"
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

export { getEventName }
