import React from 'react'
import PropTypes from 'prop-types'
import { Accordion } from 'react-bootstrap';
import { connect } from "react-redux";

import EventItem from './EventItem'
import { getEvents } from '../../../utils/events-helpers'
import { getEventsAboutUser } from "../../../store/selectors"

class EventList extends React.Component {
	getEvents () {
		const { drizzle, drizzleState } = this.props;
		const web3 = drizzle.web3;

		const contract = new web3.eth.Contract(
			drizzle.contracts.Logistic.abi,
			drizzle.contracts.Logistic.address
		)

		getEvents(
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

		if (!this.props.showAll) {
			events = getEventsAboutUser(
				events,
				this.props.eventNames,
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
	eventNames: ['allEvents'],
	filters: {},
	showAll: false
}

EventList.propTypes = {
	eventNames: PropTypes.array.isRequired,
	// filters: PropTypes.object,
	showAll: PropTypes.bool
};

const mapStateToProps = state => {
	return { events: state.eventsReducer.events }
};

export default connect(mapStateToProps)(EventList)
