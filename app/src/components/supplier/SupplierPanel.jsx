import React from 'react';
import { Card, Alert } from 'react-bootstrap';

import ProductsOwned from '../product/product-list/ProductsOwned';
import EventList from '../product/event/EventList';
import OwnedProductItem from '../product/product-item/OwnedProductItem';
import InDeliveryProductItem from '../product/product-item/InDeliveryProductItem';
import CreateProduct from './CreateProduct'
import { EVENT_NAMES,
	SUPPLIER_ADDED,
	SUPPLIER_REMOVED,
 	// NEW_PRODUCT,
 	// PRODUCT_SHIPPED,
	// PRODUCT_RECEIVED
} from "../../store/constants"
import { newContextComponents } from "@drizzle/react-components";

const { ContractForm } = newContextComponents;

class SupplierPanel extends React.Component {
	state = { dataKey: null };

	componentDidMount() {
		const { drizzle, drizzleState } = this.props;

		const contract = drizzle.contracts.Logistic;

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
			[SUPPLIER_REMOVED]: { account: drizzleState.accounts[0] },
			// when a purchaser become a supplier...
			// [NEW_PRODUCT]: { by: drizzleState.accounts[0] },
			// [PRODUCT_SHIPPED]: { from: drizzleState.accounts[0] },
			// [PRODUCT_RECEIVED]: { from: drizzleState.accounts[0] }
		}

		return (
			<div>
				<div className="section">
					<h2>Supplier Panel</h2>

					<Card className="m-2 p-2">
						<p>You have <em>{balance}</em> product(s).</p>
						<ProductsOwned
							drizzle={drizzle}
							drizzleState={drizzleState}
							balance={balance}
							productItemComponent={OwnedProductItem}
						/>
						<div className="m-2">
							<p>Add a product</p>
							<CreateProduct
								drizzle={drizzle}
								drizzleState={drizzleState}
							/>
						</div>
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
						<em>Renounce Supplier</em>
						<ContractForm
							drizzle={drizzle}
							contract="Logistic"
							method="renounceSupplier"
						/>
					</Alert>
				</div>
			</div>
		)
	}
}

export default SupplierPanel;
