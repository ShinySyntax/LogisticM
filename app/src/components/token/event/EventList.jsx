import React from 'react'
import PropTypes from 'prop-types'
import { Accordion } from 'react-bootstrap';
import { connect } from "react-redux";

import EventItem from './EventItem'
import { getPastEvents } from '../../../utils/events-helpers'
import { getEventsAboutUser } from "../../../store/selectors"
import { EVENT_NAMES } from '../../../utils/constants'

class EventList extends React.Component {
	getEvents () {
		const { drizzle } = this.props;
		const web3 = drizzle.web3;

		const contract = new web3.eth.Contract(
			drizzle.contracts.Logistic.abi,
			drizzle.contracts.Logistic.address
		)

		getPastEvents(
			contract,
			this.props.eventNames,
			this.props.filters
		)
	}

	componentDidMount () {
		this.getEvents()
	}

	render () {
		let events = this.props.events
		if (!events) return null

		events = events.filter(event => {
			let keepThis = true
			for (var key in this.props.filter) {
				if (this.props.filter.hasOwnProperty(key)) {
					if (event.returnValues[key] !== this.props.filter[key]) {
						keepThis = false
					}
				}
			}
			return keepThis && this.props.eventNames.includes(event.event)
		})
		if (!this.props.showAll) {
			events = getEventsAboutUser(
				events,
				this.props.drizzleState.accounts[0]
			)
		}

		return (
			<Accordion defaultActiveKey={1}>
				{ events.map((event, idx) => {
					return (
						<EventItem
							key={idx}
							drizzle={this.props.drizzle}
							drizzleState={this.props.drizzleState}
							event={event}
							idx={idx}
						/>
					)
				})}
			</Accordion>
		)
	}
}

EventList.defaultProps = {
	eventNames: EVENT_NAMES,
	filters: {},
	showAll: false
}

EventList.propTypes = {
	eventNames: PropTypes.array.isRequired,
	filters: PropTypes.object,
	showAll: PropTypes.bool
};

const mapStateToProps = state => {
	return { events: state.eventsReducer.events }
};

export default connect(mapStateToProps)(EventList)
