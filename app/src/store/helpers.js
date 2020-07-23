import { mapEventToString } from '../utils/constants';

export const getEventName = (event) => {
	return mapEventToString[event.event] || event.event
}
