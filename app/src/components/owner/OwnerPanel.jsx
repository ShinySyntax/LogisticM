import React from 'react'
import { Alert, Card } from 'react-bootstrap';
import { newContextComponents } from "@drizzle/react-components";

import GrantAccess from './GrantAccess'
import ProductList from '../product/ProductList'
import EventList from '../product/event/EventList';

const { ContractForm } = newContextComponents;

class OwnerPanel extends React.Component {
	state = { dataKey: null };

	componentDidMount() {
		const { drizzle } = this.props;

		const contract = drizzle.contracts.Logistic;

		// let drizzle know we want to watch the `myString` method
		const dataKey = contract.methods.totalSupply.cacheCall();

		// save the `dataKey` to local component state for later reference
		this.setState({ dataKey });
	}

	render () {
		const { drizzle, drizzleState } = this.props;

		let totalSupply = drizzleState.contracts.Logistic.totalSupply[
			this.state.dataKey
		]
		if (!totalSupply) return null
		totalSupply = Number(totalSupply.value)

		return (
			<div>
				<div className="section">
					<h2>SuperUser Panel</h2>

					<Card className="m-2 p-2">
						<p>Total product(s): {totalSupply}</p>
						<ProductList
							drizzle={drizzle}
							drizzleState={drizzleState}
							totalSupply={totalSupply}
						/>
					</Card>

					<Card className="m-2 p-2">
						<strong>Events:</strong>
						<EventList
							drizzle={drizzle}
							drizzleState={drizzleState}
							showAll={true}
						/>
					</Card>

					<div className="section">
						<div>
							<h3>Administrative tasks</h3>
							<Card className="m-2 p-2">
								<em>Add a supplier</em>
								<GrantAccess
									drizzle={drizzle}
									grandAccessMethod="addSupplier"
								/>
							</Card>
							<Card className="m-2 p-2">
								<em>Add a delivery man</em>
								<GrantAccess
									drizzle={drizzle}
									grandAccessMethod="addDeliveryMan"
								/>
							</Card>
						</div>
						<Alert variant="danger" className="m-2">
							<h3>Danger zone</h3>

							<em>Transfer ownership</em>
							<ContractForm
								drizzle={drizzle}
								contract="Logistic"
								method="transferOwnership"
							/>
							<br/>
							<em>Renounce ownership</em>
							<ContractForm
								drizzle={drizzle}
								contract="Logistic"
								method="renounceOwnership"
							/>
						</Alert>
					</div>
				</div>
			</div>
		)
	}
}

export default OwnerPanel;
