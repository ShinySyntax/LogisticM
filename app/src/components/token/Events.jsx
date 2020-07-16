import React from 'react'
import PropTypes from 'prop-types'
import { Accordion, Card, Table } from 'react-bootstrap';

import { ZERO_ADDRESS } from '../../utils/constants';

class Events extends React.Component {
	state = {
		events: null,
		currentBlock: null
	}

	getEvents () {
		const { drizzle } = this.props;
		const web3 = drizzle.web3;

		const contract = new web3.eth.Contract(
			drizzle.contracts.Logistic.abi,
			drizzle.contracts.Logistic.address
		)

		let oldEvents = []

		let eventNames = this.props.eventNames

		if (!Array.isArray(eventNames)) {
			eventNames = [eventNames]
		}

		let filters = this.props.filters || []

		eventNames.forEach((eventName, i) => {
			contract.getPastEvents(eventName, {
				fromBlock: 0,
				filter: filters[eventName]
			}).then(events => {
				oldEvents.push(...events)
				this.setState({ events: oldEvents })
			})
		});
	}

	componentDidMount () {
		this.getEvents()
	}

	static getDerivedStateFromProps (props, state) {
		if (this.state.currentBlock !== props.drizzleState.currentBlock) {
			this.getEvents()
			return { currentBlock: props.drizzleState.currentBlock }
		}
		return null;
	}

	render () {
		if (!this.state.events) return null

		let events = this.state.events

		if (this.props.filterFunction) {
			events = events.filter(this.props.filterFunction)
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

		if (eventName === 'Transfer') {
			if (event.returnValues.from === ZERO_ADDRESS) {
				eventName = "Item created"
			}
			else if (event.returnValues.to === ZERO_ADDRESS) {
				eventName = "Item send to buyer"
			}
		}

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
	eventNames: 'allEvents'
}

Events.propTypes = {
	eventNames: PropTypes.any,
	filters: PropTypes.any,
	filterFunction: PropTypes.any
};

export default Events;
