import React from 'react';
import PropTypes from 'prop-types'
import { Container,
	Row,
	Col,
	ListGroup
 } from 'react-bootstrap';

import ProductLink from "../product-page/ProductLink";
import { ZERO_ADDRESS } from '../../../store/constants';
import Address from '../Address'

class InDeliveryProductItem extends React.Component {
	state = {
		dataKeyProductsSentFrom: null,
		dataKeyProductInfo: null
	}

	getProductsSentFrom() {
		const dataKeyProductsSentFrom = this.props.drizzle.contracts.LogisticM.methods
		.productSentFrom.cacheCall(
			this.props.productHash,
			this.props.drizzleState.accounts[0]
		);
		this.setState({ dataKeyProductsSentFrom });
	}

	getProductInfo() {
		this.setState({ dataKeyProductInfo: this.props.drizzle.contracts
			.LogisticM.methods.getProductInfo.cacheCall(this.props.productHash) })
	}

	componentDidMount() {
		this.getProductsSentFrom()
		this.getProductInfo()
	}

	componentDidUpdate(prevProps, prevState) {
		if (this.props.productHash !== prevProps.productHash) {
			this.getProductsSentFrom()
			this.getProductInfo()
		}
	}

	render () {
		const tokenInDeliveryObject = this.props.drizzleState.contracts.LogisticM
			.productSentFrom[this.state.dataKeyProductsSentFrom]
		if (!tokenInDeliveryObject) return null
		const tokenInDelivery = tokenInDeliveryObject.value

		if (tokenInDelivery === ZERO_ADDRESS) return null

		const productInfoObject = this.props.drizzleState.contracts.LogisticM
			.getProductInfo[this.state.dataKeyProductInfo]
		if (!productInfoObject) return null
		const productName = productInfoObject.value.productName

		return (
			<ListGroup.Item>
				<Container fluid>
				  <Row>
				    <Col md="auto">
							<span className="m-2">
								<ProductLink productName={productName} />
							</span>
						</Col>
						<Col>
							<span className="m-2">
								to: <Address
									drizzle={this.props.drizzle}
									drizzleState={this.props.drizzleState}
									address={tokenInDelivery}
								/>
							</span>
						</Col>
				  </Row>
				</Container>

			</ListGroup.Item>
		)
	}
}

InDeliveryProductItem.propTypes = {
	productHash: PropTypes.string.isRequired
};

export default InDeliveryProductItem;
