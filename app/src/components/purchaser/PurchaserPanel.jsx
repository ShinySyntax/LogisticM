import React from 'react'
import PropTypes from 'prop-types'
import { Card } from 'react-bootstrap';

import { getEventsAboutToken } from "../../store/selectors"
import History from '../product/product-page/History'
import WillReceiveProductItem from '../product/product-item/WillReceiveProductItem';
import ProductLink from "../product/product-page/ProductLink";
import ProductAccountForm from '../product/ProductAccountForm'
import { HANDOVER } from "../../store/constants"

class PurchaserPanel extends React.Component {
	// { '1561561111': [event1, event2...]}
	state = {}

	componentDidUpdate(prevProps, prevState) {
		if (this.props.tokenIds !== prevProps.tokenIds) {
			let state = {}
			this.props.tokenIds.forEach(tokenId => {
				let eventsToken = getEventsAboutToken(this.props.events, tokenId)
				state[tokenId] = eventsToken
			});
			this.setState(state);
		}
	}

	receiveToken = (tokenId, sender) => {
		this.props.drizzle.contracts.Logistic.methods.receive.cacheSend(
			sender, tokenId
		)
	}

	render () {
		return (
			<div>
				<div className="section">
					<h2>Purchaser Panel</h2>

					<Card className="m-2 p-2">
						<p>Receive a product</p>
						<ProductAccountForm
							accountLabel="Sender"
							handleSubmit={this.receiveToken}
						/>
					</Card>

					{
						Object.entries(this.state).map(([tokenId, events], idx) => {
							return (
								<Card className="m-2 p-2" key={idx}>
									<Card.Title><span>Product id: </span>
										<ProductLink
											tokenId={tokenId}
										/>
									</Card.Title>
									<History
										drizzle={this.props.drizzle}
										drizzleState={this.props.drizzleState}
										handovers={events.filter(ev => ev.event === HANDOVER)}
									/>
									<WillReceiveProductItem
										drizzle={this.props.drizzle}
										drizzleState={this.props.drizzleState}
										tokenId={tokenId}
									/>
								</Card>
							)
						})
					}

				</div>
			</div>
		)
	}
}

PurchaserPanel.propTypes = {
	events: PropTypes.array.isRequired, // Events about the user
	tokenIds: PropTypes.array.isRequired // Tokens for the user
};

export default PurchaserPanel;
