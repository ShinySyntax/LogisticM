import React from 'react';
import { Card } from 'react-bootstrap';

import EventList from '../token/event/EventList';
import TokensOwned from '../token/TokensOwned';
import TokenList from '../token/TokenList'
import WillReceiveTokenItem from '../token/token-item/WillReceiveTokenItem';
import OwnedTokenItem from '../token/token-item/OwnedTokenItem';
import InDeliveryTokenItem from '../token/token-item/InDeliveryTokenItem';
import { DELIVERY_MAN_EVENT_NAMES,
	DELIVERY_MAN_ADDED,
	DELIVERY_MAN_REMOVED,
 	PRODUCT_SHIPPED } from "../../store/constants"
import TokenAccountForm from '../token/TokenAccountForm'

class DeliveryManPanel extends React.Component {
	state = {
		dataKey: null
	};

	componentDidMount() {
		const { drizzle, drizzleState } = this.props
		const contract = drizzle.contracts.Logistic;

		this.setState({
			dataKey: contract.methods.balanceOf.cacheCall(
				drizzleState.accounts[0])
		});
	}

	receiveToken = (tokenId, sender) => {
		this.props.drizzle.contracts.Logistic.methods.receive.cacheSend(
			sender, tokenId
		)
	}

	render () {
		const { drizzle, drizzleState } = this.props

		const balanceObject = drizzleState.contracts.Logistic.balanceOf[
			this.state.dataKey
		]
		if (!balanceObject) return null
		const balance = Number(balanceObject.value)

		const filters = {
			[DELIVERY_MAN_ADDED]: { account: drizzleState.accounts[0] },
			[DELIVERY_MAN_REMOVED]: { account: drizzleState.accounts[0] },
			[PRODUCT_SHIPPED]: { to: this.props.drizzleState.accounts[0] }
		}

		const tokenIds = this.props.drizzleState.events.events
			.filter(event => event.event === PRODUCT_SHIPPED)
			.map(event => {
				return event.returnValues.tokenId
			})

		return (
			<div>
				<div className="section">
					<h2>Logistic - Delivery Man Panel</h2>
					<Card className="m-2 p-2">
						<p>Receive a product</p>
						<TokenAccountForm
							accountLabel="Sender"
							handleSubmit={this.receiveToken}
						/>

						<p>Product(s) that you will receive</p>
						<TokenList
							drizzle={drizzle}
							drizzleState={drizzleState}
							tokenIds={tokenIds}
							tokenItemComponent={WillReceiveTokenItem}
						/>
					</Card>

					<Card className="m-2 p-2">
						<p>You have <em>{balance}</em> product(s).</p>
						<TokensOwned
							drizzle={drizzle}
							drizzleState={drizzleState}
							balance={balance}
							tokenItemComponent={OwnedTokenItem}
						/>
					</Card>

					<Card className="m-2 p-2">
						<p>Product(s) in delivery</p>
						<TokensOwned
							drizzle={drizzle}
							drizzleState={drizzleState}
							balance={balance}
							tokenItemComponent={InDeliveryTokenItem}
							/>
					</Card>

					<Card className="m-2 p-2">
						<p><em>Activity</em></p>
						<EventList
							drizzle={drizzle}
							drizzleState={drizzleState}
							eventNames={DELIVERY_MAN_EVENT_NAMES}
							filters={filters}
						/>
					</Card>
				</div>
			</div>
		)
	}
}

export default DeliveryManPanel;
