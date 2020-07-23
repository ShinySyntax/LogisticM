import React from 'react'
import { Card } from 'react-bootstrap';

import { PRODUCT_EVENT_NAMES } from '../../../utils/constants'
import { getEvents } from '../../../utils/events-helpers'

class TokenDetail extends React.Component {
	getEvents () {
		const { drizzle, drizzleState } = this.props;
		const web3 = drizzle.web3;

		const contract = new web3.eth.Contract(
			drizzle.contracts.Logistic.abi,
			drizzle.contracts.Logistic.address
		)

		getEvents(
			contract,
			PRODUCT_EVENT_NAMES,
			this.props.filters
		)
	}

	componentDidMount () {
		this.getEvents()
	}

	render () {
		return (
			<div className="section">
				<h2>Logistic - Product Details</h2>

				<Card className="m-2 p-2">
					<p>The token is: <em>{this.props.match.params.tokenId}</em></p>
				</Card>
			</div>
		)
	}
}

export default TokenDetail;
