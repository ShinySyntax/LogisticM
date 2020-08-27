import React from 'react'
import PropTypes from 'prop-types'
import { Card } from 'react-bootstrap';

import { getEventsAboutProductHash } from "../../store/selectors"
import ProductAccountForm from '../product/ProductAccountForm'
import { receive } from '../../contract-call'
import PurchaserProductDetail from './PurchaserProductDetail'

class PurchaserPanel extends React.Component {
	receiveToken = (productHash, sender) => {
		receive(this.props.drizzle, this.props.drizzleState, sender, productHash)
	}

	render () {
		return (
			<div className="section">
				<h2>Purchaser Panel</h2>

				<Card className="m-2 p-2">
					<p>Receive a product</p>
					<ProductAccountForm
						accountLabel="Sender"
						handleSubmit={this.receiveToken}
					/>
				</Card>
				{this.props.productHashList.map((productHash, idx) => {
					return (
						<PurchaserProductDetail
							key={idx}
							drizzle={this.props.drizzle}
							drizzleState={this.props.drizzleState}
							productHash={productHash}
							events={getEventsAboutProductHash(this.props.events, productHash)}
						/>
					)
				})}
			</div>
		)
	}
}

PurchaserPanel.propTypes = {
	events: PropTypes.array.isRequired, // Events about the user
	productHashList: PropTypes.array.isRequired // Tokens for the user
};

export default PurchaserPanel;
