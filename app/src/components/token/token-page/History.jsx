import React from 'react'
import PropTypes from 'prop-types'

import { NEW_ITEM,
	PRODUCT_RECEIVED,
	SEND_TO_PURCHASER } from '../../../utils/constants'
import Address from "../Address"

class History extends React.Component {
	state = {
		handOvers: []
	}

	componentDidUpdate(prevProps, prevState) {
		if (this.props.events === prevProps.events) return null
		let handOvers = []
		this.props.events.reverse().forEach(event => {
			switch (event.event) {
				case NEW_ITEM:
					handOvers.push({
						method: this.renderCreation,
						account: event.returnValues.by
					});
					break;
				case PRODUCT_RECEIVED:
					handOvers.push({
						method: this.renderTransfer,
						account: event.returnValues.by
					});
					break;
				case SEND_TO_PURCHASER:
					handOvers.push({
						method: this.renderSentToPurchaser,
						account: event.returnValues.by
					});
					break;
				default: break;
			}
		});
		this.setState({ handOvers });
	}

	renderCreation(handOver, idx) {
		return (
			<p key={idx}>
				<em>Supplier</em> <Address address={handOver.account} /> created
				the product
			</p>
		)
	}

	renderTransfer(handOver, idx) {
		return (
			<p key={idx}>
				<em>Delivery man</em> <Address address={handOver.account} /> received
					the product
				</p>
			)
		}

	renderSentToPurchaser(handOver, idx) {
		// it can be a supplier, instead of a delivery man
		return (
			<p key={idx}>
				<em>Delivery man (or supplier)</em> <Address address={handOver.account} /> sent
				the product to the purchaser
			</p>
		)
	}

	render () {
		return (
			<React.Fragment>
				{this.state.handOvers.map((handOver, idx) => {
					return handOver.method(handOver, idx)
				})}
			</React.Fragment>
		)
	}
}

History.propTypes = {
	// Events about the tokenId we want to see
	events: PropTypes.array.isRequired,
};

export default History;
