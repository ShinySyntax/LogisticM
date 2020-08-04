import React from 'react'
import PropTypes from 'prop-types'
import { Card } from 'react-bootstrap';

import { getEventsAboutProduct } from "../../store/selectors"
import History from '../product/product-page/History'
import WillReceiveProductItem from '../product/product-item/WillReceiveProductItem';
import ProductLink from "../product/product-page/ProductLink";
import ProductAccountForm from '../product/ProductAccountForm'
import { HANDOVER } from "../../store/constants"
import { receive } from '../../contract-call'

class PurchaserPanel extends React.Component {
	// { '1561561111': [event1, event2...]}
	state = {}

	componentDidUpdate(prevProps, prevState) {
		if (this.props.productIds !== prevProps.productIds) {
			let state = {}
			this.props.productIds.forEach(productName => {
				let eventsToken = getEventsAboutProduct(this.props.events, productName)
				state[productName] = eventsToken
			});
			this.setState(state);
		}
	}

	receiveToken = (productName, sender) => {
		receive(this.props.drizzle, sender, productName)
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
						Object.entries(this.state).map(([productName, events], idx) => {
							return (
								<Card className="m-2 p-2" key={idx}>
									<Card.Title><span>Product id: </span>
										<ProductLink
											productName={productName}
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
										productName={productName}
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
	productIds: PropTypes.array.isRequired // Tokens for the user
};

export default PurchaserPanel;
