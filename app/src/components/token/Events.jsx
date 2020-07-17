import React from 'react'
import PropTypes from 'prop-types'
import { Accordion, Card, Table } from 'react-bootstrap';
import { connect } from "react-redux";

import { ZERO_ADDRESS } from '../../utils/constants';
import { addAllEvents } from '../../store/actions'

class Events extends React.Component {
	getEvents () {
		const { drizzle } = this.props;
		const web3 = drizzle.web3;

		const contract = new web3.eth.Contract(
			drizzle.contracts.Logistic.abi,
			drizzle.contracts.Logistic.address
		)

		this.props.eventNames.forEach((eventName, i) => {
			contract.getPastEvents(eventName, {
				fromBlock: 0,
				filter: this.props.filters[eventName]
			}).then(events => {
				this.props.addAllEvents(events)
			})
		});
	}

	componentDidMount () {
		this.getEvents()
	}

	render () {
		let events = this.props.events
		if (!events) return null

		if (!this.props.showAll) {
			events = events.filter(event => {
				let show = false
				for (let key in event.returnValues) {
					if (event.returnValues.hasOwnProperty(key) &&
						event.returnValues[key] === this.props.drizzleState.accounts[0]) {
						show = true
					}
				}
				return show
			})
		}

		return (
			<Accordion defaultActiveKey="0">
				{ events.map((event, idx) => {
					return this.renderEvent(event, idx)
				}) }
			</Accordion>
		)
	}

	renderEvent (event, idx) {
		let keys = [];
		for (let key in event.returnValues) {
			if (event.returnValues.hasOwnProperty(key)
				&& isNaN(key) ) {
				keys.push(key);
			}
		}

		let eventName = event.event

		return (
			<Card key={idx}>
				<Accordion.Toggle as={Card.Header} eventKey={idx+1}>
					{eventName}
				</Accordion.Toggle>
				<Accordion.Collapse eventKey={idx+1}>
					<Card.Body>
						<Table bordered hover size="sm" striped={false}>
						  <tbody>
								{
									keys.map((key, idx) => {
										return this.renderReturnValue(
											key,
											event.returnValues[key],
											idx
										)
									})
								}
						  </tbody>
						</Table>
					</Card.Body>
				</Accordion.Collapse>
			</Card>
		)
	}

	renderReturnValue(key, value, idx) {
		if (value === ZERO_ADDRESS) return null

		if (this.props.drizzleState.accounts[0] === value) {
			value += ' (you)'
		}

		return (
			<tr key={idx}>
				<td>{key}</td>
				<td>{value}</td>
			</tr>
		)
	}
}

Events.defaultProps = {
	eventNames: ['allEvents'],
	filters: {},
	showAll: false
}

Events.propTypes = {
	eventNames: PropTypes.array.isRequired,
	filters: PropTypes.object,
	showAll: PropTypes.bool
};

const mapStateToProps = state => {
	return { events: state.eventsReducer.events }
};

export default connect(mapStateToProps, { addAllEvents })(Events)
