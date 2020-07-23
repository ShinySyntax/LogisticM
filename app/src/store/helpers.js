import {
	ZERO_ADDRESS,
	PRODUCT_SHIPPED,
	PRODUCT_RECEIVED,
	TRANSFER
} from '../utils/constants';

export const getEventName = (event, account) => {
	let eventName = event.event

	switch (eventName) {
		case PRODUCT_SHIPPED:
			eventName = "Product shipped"
			if (event.returnValues.from === account) {
				eventName += ' by me'
			}
			else if (event.returnValues.to === account) {
				eventName += ' to me'
			}
			break;
		case PRODUCT_RECEIVED:
			eventName = "Product received"
			if (event.returnValues.by === account) {
				eventName += ' by me'
			}
			else if (event.returnValues.from === account) {
				eventName += ' from me'
			}
			break;
		case TRANSFER:
			if (event.returnValues.from === ZERO_ADDRESS) {
				eventName = "Product created"
			}
			else if (event.returnValues.to === ZERO_ADDRESS) {
				eventName = "Product sent to purchaser"
			}
			break;
	}

	return eventName
}
