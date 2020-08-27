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

export const getEventsAboutProductHash = (events, productHash) => {
	return events.filter(event => {
		let isAboutToken = false
		for (let key in event.returnValues) {
			if (event.returnValues.hasOwnProperty(key) &&
				event.returnValues.productHash === productHash) {
				isAboutToken = true
			}
		}
		return isAboutToken
	})
}

export const getEventsAboutProductName = (events, productName) => {
	return events.filter(event => {
		let isAboutToken = false
		for (let key in event.returnValues) {
			if (event.returnValues.hasOwnProperty(key) &&
				event.returnValues.productName === productName) {
				isAboutToken = true
			}
		}
		return isAboutToken
	})
}
