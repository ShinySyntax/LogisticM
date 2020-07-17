import React from 'react';
import { Card } from 'react-bootstrap';

import Events from '../token/Events';
import TokensOwned from '../token/TokensOwned';
import TokenList from '../token/TokenList'
import WillReceiveTokenItem from './WillReceiveTokenItem';
import OwnedTokenItem from '../token/token-item/OwnedTokenItem';
import InDeliveryTokenItem from '../token/token-item/InDeliveryTokenItem';


class MerchantPanel extends React.Component {
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
		console.log("balance:", balance);

		let totalSupply = drizzleState.contracts.Logistic.totalSupply[
			this.state.dataKeyTotalSupply
		]
		if (!totalSupply) return null
		totalSupply = Number(totalSupply.value)

		return (
			<div>
				<div className="section">
					<h2>Logistic - Merchant Panel</h2>

					<Card className="m-2 p-2">
						<p>Product(s) that you will receive</p>
						<TokenList
							drizzle={drizzle}
							drizzleState={drizzleState}
							n={totalSupply}
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
						<Events
							drizzle={drizzle}
							drizzleState={drizzleState}
							eventNames={['MerchantAdded', 'Approval', 'Transfer']}
							filters={
								{
									MerchantAdded: {
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

export default MerchantPanel;
