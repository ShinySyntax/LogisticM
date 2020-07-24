import React from 'react'
import PropTypes from 'prop-types'
import { Badge } from 'react-bootstrap';

import { NEW_ITEM,
	PRODUCT_RECEIVED,
	SEND_TO_PURCHASER } from '../../../utils/constants'

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
				<em>Maker</em> <Badge variant="info">{handOver.account}</Badge> created
				the product
			</p>
		)
	}

	renderTransfer(handOver, idx) {
		return (
			<p key={idx}>
				<em>Delivery man</em> <Badge variant="info">{handOver.account}</Badge> received
					the product
				</p>
			)
		}

	renderSentToPurchaser(handOver, idx) {
		// it can be a maker, instead of a delivery man
		return (
			<p key={idx}>
				<em>Delivery man</em> <Badge variant="info">{handOver.account}</Badge> sent
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
	events: PropTypes.array.isRequired,
};

export default History;
