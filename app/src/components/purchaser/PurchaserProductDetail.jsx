import React from 'react'
import PropTypes from 'prop-types'
import { Card } from 'react-bootstrap';

import History from '../product/product-page/History'
import WillReceiveProductItem from '../product/product-item/WillReceiveProductItem';
import ProductLink from "../product/product-page/ProductLink";
import { HANDOVER } from "../../store/constants"

class PurchaserProductDetail extends React.Component {
	state = {
		productName: null
	}

	getProductName() {
		this.props.drizzle.contracts.Logistic.methods
		.getProductInfo(this.props.productHash)
		.call()
		.then(productInfo => {
			this.setState(
				{
					productName: productInfo.productName
				}
			)
		})
	}

	componentDidUpdate(prevProps, prevState) {
		if (this.props.productHash !== prevProps.productHash) {
			this.getProductName()
		}
	}

	componentDidMount() {
		this.getProductName()
	}

	render () {
		if (!this.state.productName) return null

		return (
			<Card className="m-2 p-2">
				<Card.Title><span>Product id: </span>
					<ProductLink
						productName={this.state.productName}
					/>
				</Card.Title>
				<History
					drizzle={this.props.drizzle}
					drizzleState={this.props.drizzleState}
					handovers={this.props.events.filter(ev => ev.event === HANDOVER)}
				/>
				<WillReceiveProductItem
					drizzle={this.props.drizzle}
					drizzleState={this.props.drizzleState}
					productHash={this.props.productHash}
				/>
			</Card>
		)
	}
}

PurchaserProductDetail.propTypes = {
	productHash: PropTypes.string.isRequired,
	events: PropTypes.array.isRequired
};

export default PurchaserProductDetail;
