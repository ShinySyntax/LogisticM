import React from 'react';
import { Card } from 'react-bootstrap';

import TokensOwned from '../token/TokensOwned';
import EventList from '../token/event/EventList';
import OwnedTokenItem from '../token/token-item/OwnedTokenItem';
import InDeliveryTokenItem from '../token/token-item/InDeliveryTokenItem';
import NewProduct from './NewProduct';
import { SUPPLIER_EVENT_NAMES,
	SUPPLIER_ADDED,
	SUPPLIER_REMOVED } from "../../utils/constants"

class SupplierPanel extends React.Component {
	state = { dataKey: null };

	componentDidMount() {
		const { drizzle, drizzleState } = this.props;

		const contract = drizzle.contracts.Logistic;

		// let drizzle know we want to watch the `myString` method
		const dataKey = contract.methods.balanceOf.cacheCall(
			drizzleState.accounts[0]
		);

		// save the `dataKey` to local component state for later reference
		this.setState({ dataKey });
	}

	render () {
		const { drizzle, drizzleState } = this.props

		const balanceObject = drizzleState.contracts.Logistic.balanceOf[
			this.state.dataKey
		]

		if (!balanceObject) return null

		const balance = Number(balanceObject.value)

		const filters = {
			[SUPPLIER_ADDED]: { account: drizzleState.accounts[0] },
			[SUPPLIER_REMOVED]: { account: drizzleState.accounts[0] }
			// TODO: try to filter owned tokens
		}

		return (
			<div>
				<div className="section">
					<h2>Logistic - Supplier Panel</h2>

					<Card className="m-2 p-2">
						<p>You have <em>{balance}</em> product(s).</p>
						<TokensOwned
							drizzle={drizzle}
							drizzleState={drizzleState}
							balance={balance}
							tokenItemComponent={OwnedTokenItem}
						/>
						<div className="m-2">
							<p>Add a product</p>
							<NewProduct
								drizzle={drizzle}
								drizzleState={drizzleState}
							/>
						</div>
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
							eventNames={SUPPLIER_EVENT_NAMES}
							filters={filters}
						/>
					</Card>
				</div>
			</div>
		)
	}
}

export default SupplierPanel;
