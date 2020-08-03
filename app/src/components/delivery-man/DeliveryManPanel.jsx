import React from 'react';
import { Card } from 'react-bootstrap';

import EventList from '../product/event/EventList';
import ProductsOwned from '../product/ProductsOwned';
import ProductList from '../product/ProductList'
import WillReceiveProductItem from '../product/product-item/WillReceiveProductItem';
import OwnedProductItem from '../product/product-item/OwnedProductItem';
import InDeliveryProductItem from '../product/product-item/InDeliveryProductItem';
import { DELIVERY_MAN_EVENT_NAMES,
	DELIVERY_MAN_ADDED,
	DELIVERY_MAN_REMOVED,
 	PRODUCT_SHIPPED } from "../../store/constants"
import ProductAccountForm from '../product/ProductAccountForm'

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

	receiveToken = (productId, sender) => {
		if (sender.startsWith('0x') && sender.length === 42) {
			this.props.drizzle.contracts.Logistic.methods.receive.cacheSend(
				sender, productId
			)
		}
		else {
			this.props.drizzle.contracts.Logistic.methods.receiveWithName.cacheSend(
				sender, productId
			)
		}
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

		const productIds = this.props.drizzleState.events.events
			.filter(event => event.event === PRODUCT_SHIPPED)
			.map(event => {
				return event.returnValues.productId
			})

		return (
			<div>
				<div className="section">
					<h2>Delivery Man Panel</h2>
					<Card className="m-2 p-2">
						<p>Receive a product</p>
						<ProductAccountForm
							accountLabel="Sender"
							handleSubmit={this.receiveToken}
						/>
					</Card>

					<Card className="m-2 p-2">
						<p>Product(s) that you will receive</p>
						<ProductList
							drizzle={drizzle}
							drizzleState={drizzleState}
							productIds={productIds}
							tokenItemComponent={WillReceiveProductItem}
						/>
					</Card>

					<Card className="m-2 p-2">
						<p>You have <em>{balance}</em> product(s).</p>
						<ProductsOwned
							drizzle={drizzle}
							drizzleState={drizzleState}
							balance={balance}
							tokenItemComponent={OwnedProductItem}
						/>
					</Card>

					<Card className="m-2 p-2">
						<p>Product(s) in delivery</p>
						<ProductsOwned
							drizzle={drizzle}
							drizzleState={drizzleState}
							balance={balance}
							tokenItemComponent={InDeliveryProductItem}
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
