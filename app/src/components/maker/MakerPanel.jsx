import React from 'react';
import { newContextComponents } from "@drizzle/react-components";
import { ListGroup,
	Popover,
	OverlayTrigger,
	Button,
	Collapse
} from 'react-bootstrap';

import TokensOwned from '../token/TokensOwned';
import Events from '../token/Events';
import TokenItem from './TokenItem';

// import { ZERO_ADDRESS } from '../../utils/constants';

const { ContractForm } = newContextComponents;

class MakerPanel extends React.Component {
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

	// eventFilterFunction = (event) => {
	// 	if (event.event === "Transfer") {
	// 		return event.returnValues.from !== ZERO_ADDRESS
	// 	}
	// 	return true
	// }

	renderBalance = (balance) => {
		return balance
	}

	render () {
		const { drizzle, drizzleState } = this.props

		const balanceObject = drizzleState.contracts.Logistic.balanceOf[
			this.state.dataKey
		]

		if (!balanceObject) return null

		const balance = Number(balanceObject.value)

		return (
			<div>
				<div className="section">
					<h2>Logistic - Maker Panel</h2>

					<p>you have <em>{balance}</em> item(s).</p>

					<br/>
					<TokensOwned
						drizzle={drizzle}
						drizzleState={drizzleState}
						balance={balance}
						tokenItemComponent={TokenItem}
					>
					</TokensOwned>
					<br/>

					<em>Create a new item</em>
					<ContractForm
						drizzle={drizzle}
						contract="Logistic"
						method="newItem"
					/>

					<br/>
					<Events
						drizzle={drizzle}
						drizzleState={drizzleState}
						eventNames={['MakerAdded', 'Transfer']}
						filters={
							{
								MakerAdded: {
									account: drizzleState.accounts[0]
								}
							}
						}
					/>
					<br/>

					<em>Send an item</em>
					<ContractForm
						drizzle={drizzle}
						contract="Logistic"
						method="send"
					/>
				</div>
			</div>
		)
	}
}

export default MakerPanel;
