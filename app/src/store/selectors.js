// this is not really  selectors as it doesn't take a state argument
export const getEventsAboutUser = (events, account) => {
	return events.filter(event => {
		let isAboutUser = false
		for (let key in event.returnValues) {
			if (event.returnValues.hasOwnProperty(key) &&
				event.returnValues[key] === account) {
				isAboutUser = true
			}
		}
		return isAboutUser
	})
}

export const getEventsAboutToken = (events, productId) => {
	return events.filter(event => {
		let isAboutToken = false
		for (let key in event.returnValues) {
			if (event.returnValues.hasOwnProperty(key) &&
				event.returnValues.productId === productId) {
				isAboutToken = true
			}
		}
		return isAboutToken
	})
}
