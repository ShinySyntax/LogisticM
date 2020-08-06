import React from 'react'
import PropTypes from 'prop-types'
import { Accordion, Card, Table } from 'react-bootstrap';

import { ZERO_ADDRESS } from '../../../store/constants';
import { getBlockTimestamp } from '../../../store/events-helpers';
import ProductLink from "../product-page/ProductLink";
import Address from "../Address"
import Web3 from "web3";

class EventItem extends React.Component {
	state = {
		time: null
	}

	getReturnValus = () => {
		let keys = [];
		for (let key in this.props.event.returnValues) {
			if (this.props.event.returnValues.hasOwnProperty(key)
				&& isNaN(key) ) {
				keys.push(key);
			}
		}
		return keys
	}

	componentDidMount() {
		getBlockTimestamp(
			this.props.drizzle.web3,
			this.props.event.blockNumber
		).then(time => this.setState({ time }))
	}

	render () {
		const idx = this.props.idx
		const event = this.props.event;

		let keys = this.getReturnValus()

		return (
			<Card>
				<Accordion.Toggle as={Card.Header} eventKey={idx+1}>
					<span>{event.eventName} - <em>{this.state.time}</em></span>
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
		if (key === "productHash") return null

		if (key === 'productName') {
			return (
				<tr key={idx}>
					<td>{key}</td>
					<td>
						<ProductLink
							productName={value}
						/>
					</td>
				</tr>
			)
		}

		if (Web3.utils.isAddress(value)) {
			return (
				<tr key={idx}>
					<td>{key}</td>
					<td>
						<Address
							drizzle={this.props.drizzle}
							drizzleState={this.props.drizzleState}
							address={value}
							useAddress={true}
						/>
				</td>
				</tr>
			)
		}

		return (
			<tr key={idx}>
				<td>{key}</td>
				<td>{value}</td>
			</tr>
		)
	}
}

EventItem.propTypes = {
	drizzleState: PropTypes.object.isRequired,
	drizzle: PropTypes.object.isRequired,
	event: PropTypes.object.isRequired,
	idx: PropTypes.number.isRequired
};

export default EventItem;
