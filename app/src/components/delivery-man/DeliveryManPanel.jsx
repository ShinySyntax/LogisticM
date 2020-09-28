import React from 'react';
import { Card, Alert } from 'react-bootstrap';
import Web3 from 'web3';

import EventList from '../product/event/EventList';
import ProductsOwned from '../product/product-list/ProductsOwned';
import ProductWillReceive from '../product/product-list/ProductWillReceive'
import OwnedProductItem from '../product/product-item/OwnedProductItem';
import InDeliveryProductItem from '../product/product-item/InDeliveryProductItem';
import { EVENT_NAMES,
	DELIVERY_MAN_ADDED,
	DELIVERY_MAN_REMOVED,
 	PRODUCT_SHIPPED } from "../../store/constants"
import ProductAccountForm from '../product/ProductAccountForm'
import { receive } from '../../contract-call'
import { newContextComponents } from "@drizzle/react-components";

const { ContractForm } = newContextComponents;

class DeliveryManPanel extends React.Component {
	state = {
		dataKey: null
	};

	componentDidMount() {
		const { drizzle, drizzleState } = this.props
		const contract = drizzle.contracts.LogisticM;

		this.setState({
			dataKey: contract.methods.balanceOf.cacheCall(
				drizzleState.accounts[0])
		});
	}

	receiveProduct = (productId, sender) => {
		receive(this.props.drizzle, this.props.drizzleState, sender,
			Web3.utils.keccak256(productId))
	}

	render () {
		const { drizzle, drizzleState } = this.props

		const balanceObject = drizzleState.contracts.LogisticM.balanceOf[
			this.state.dataKey
		]
		if (!balanceObject) return null
		const balance = Number(balanceObject.value)

		const filters = {
			[DELIVERY_MAN_ADDED]: { account: drizzleState.accounts[0] },
			[DELIVERY_MAN_REMOVED]: { account: drizzleState.accounts[0] },
			// when a purchaser become a delivery man...
			// [PRODUCT_SHIPPED]: { to: this.props.drizzleState.accounts[0] }
		}

		let productHashList = this.props.drizzleState.events.events
			.filter(event => event.event === PRODUCT_SHIPPED)
			.map(event => {
				return event.returnValues.productHash
			})

		productHashList = [...new Set(productHashList)];

		return (
			<div>
				<div className="section">
					<h2>Delivery Man Panel</h2>
					<Card className="m-2 p-2">
						<p>Receive a product</p>
						<ProductAccountForm
							accountLabel="Sender"
							handleSubmit={this.receiveProduct}
						/>
					</Card>

					<Card className="m-2 p-2">
						<p>Product(s) that you will receive</p>
						<ProductWillReceive
							drizzle={drizzle}
							drizzleState={drizzleState}
							productHashList={productHashList}
						/>
					</Card>

					<Card className="m-2 p-2">
						<p>You have <em>{balance}</em> product(s).</p>
						<ProductsOwned
							drizzle={drizzle}
							drizzleState={drizzleState}
							balance={balance}
							productItemComponent={OwnedProductItem}
						/>
					</Card>

					<Card className="m-2 p-2">
						<p>Product(s) in delivery</p>
						<ProductsOwned
							drizzle={drizzle}
							drizzleState={drizzleState}
							balance={balance}
							productItemComponent={InDeliveryProductItem}
							/>
					</Card>

					<Card className="m-2 p-2">
						<p><em>Activity</em></p>
						<EventList
							drizzle={drizzle}
							drizzleState={drizzleState}
							eventNames={EVENT_NAMES}
							filters={filters}
						/>
					</Card>
					<Alert variant="danger" className="m-2">
						<h3>Danger zone</h3>
						<em>Renounce Delivery man</em>
						<ContractForm
							drizzle={drizzle}
							contract="LogisticM"
							method="renounceDeliveryMan"
						/>
					</Alert>
				</div>
			</div>
		)
	}
}

export default DeliveryManPanel;
