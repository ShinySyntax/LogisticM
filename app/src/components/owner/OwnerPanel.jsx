import React from 'react'
import { Alert } from 'react-bootstrap';
import { newContextComponents } from "@drizzle/react-components";

import GrantAccess from './GrantAccess'
import TokenList from '../token/TokenList'
import Events from '../token/Events';

const { AccountData, ContractForm } = newContextComponents;

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
					<h2>Logistic - SuperUser Panel</h2>
					<AccountData
						drizzle={drizzle}
						drizzleState={drizzleState}
						accountIndex={0}
						units="ether"
						precision={5}
					/>

				<em>Total item(s): </em>{totalSupply}

				<TokenList drizzle={drizzle} drizzleState={drizzleState} n={totalSupply} />
				<strong>Events:</strong>
				<Events drizzle={drizzle} drizzleState={drizzleState} showAll={true} />

					<div>
						<h3>Administrative tasks</h3>
						<em>Add a maker</em>
						<GrantAccess drizzle={drizzle} grandAccessMethod="addMaker" />
						<br/>
						<em>Add a merchant</em>
						<GrantAccess drizzle={drizzle} grandAccessMethod="addMerchant" />
					</div>
					<Alert variant="danger" className="m-2">
						<h3>Danger zone</h3>

						<em>Transfer ownership</em>
						<ContractForm drizzle={drizzle} contract="Logistic" method="transferOwnership" />
						<br/>
						<em>Renounce ownership</em>
						<ContractForm drizzle={drizzle} contract="Logistic" method="renounceOwnership" />
					</Alert>
				</div>
			</div>
		)
	}
}

export default OwnerPanel;
