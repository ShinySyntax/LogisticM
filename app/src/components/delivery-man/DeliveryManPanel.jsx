import React from 'react';
import { Card } from 'react-bootstrap';

import EventList from '../token/event/EventList';
import TokensOwned from '../token/TokensOwned';
import TokenList from '../token/TokenList'
import WillReceiveTokenItem from './WillReceiveTokenItem';
import OwnedTokenItem from '../token/token-item/OwnedTokenItem';
import InDeliveryTokenItem from '../token/token-item/InDeliveryTokenItem';
import { DELIVERY_MAN_EVENT_NAMES } from "../../utils/constants"

class DeliveryManPanel extends React.Component {
	state = {
		dataKeyBalanceOf: null,
		dataKeyTotalSupply: null
	};

	componentDidMount() {
		const { drizzle, drizzleState } = this.props
		const contract = drizzle.contracts.Logistic;

		this.setState({
			dataKeyBalanceOf: contract.methods.balanceOf.cacheCall(
				drizzleState.accounts[0]),
			dataKeyTotalSupply: contract.methods.totalSupply.cacheCall()
		});
	}

	render () {
		const { drizzle, drizzleState } = this.props

		const balanceObject = drizzleState.contracts.Logistic.balanceOf[
			this.state.dataKeyBalanceOf
		]
		if (!balanceObject) return null
		const balance = Number(balanceObject.value)

		let totalSupply = drizzleState.contracts.Logistic.totalSupply[
			this.state.dataKeyTotalSupply
		]
		if (!totalSupply) return null
		totalSupply = Number(totalSupply.value)

		return (
			<div>
				<div className="section">
					<h2>Logistic - Delivery Man Panel</h2>

					<Card className="m-2 p-2">
						<p>Product(s) that you will receive</p>
						<TokenList
							drizzle={drizzle}
							drizzleState={drizzleState}
							totalSupply={totalSupply}
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
							filters={
								{
									DeliveryManAdded: {
										account: drizzleState.accounts[0]
									}
								}
							}
						/>
					</Card>
				</div>
			</div>
		)
	}
}

export default DeliveryManPanel;
