// this is not really a selector as it doesn't take a state argument
export const getEventsAboutUser = (events, eventNameList, account) => {
	return events.filter(event => {
		let isAboutUser = false
		for (let key in event.returnValues) {
			if (event.returnValues.hasOwnProperty(key) &&
				event.returnValues[key] === account) {
				isAboutUser = true
			}
		}
		return eventNameList.includes(event.event) && isAboutUser
	})
}
