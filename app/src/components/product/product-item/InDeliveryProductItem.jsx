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
import Web3 from "web3";

class InDeliveryProductItem extends React.Component {
	state = {
		dataKey: null
	}

	getPendingDelivery() {
		const dataKey = this.props.drizzle.contracts.Logistic.methods
		.productsSentFrom.cacheCall(
			Web3.utils.keccak256(this.props.productName),
			this.props.drizzleState.accounts[0]
		);
		this.setState({ dataKey });
	}

	componentDidMount() {
		this.getPendingDelivery()
	}

	componentDidUpdate(prevProps, prevState) {
		if (this.props.productName !== prevProps.productName) {
			this.getPendingDelivery()
		}
	}

	render () {
		const tokenInDeliveryObject = this.props.drizzleState.contracts.Logistic
			.productsSentFrom[this.state.dataKey]
		if (!tokenInDeliveryObject) return null
		const tokenInDelivery = tokenInDeliveryObject.value

		if (tokenInDelivery === ZERO_ADDRESS) return null

		return (
			<ListGroup.Item>
				<Container fluid>
				  <Row>
				    <Col md="auto">
							<span className="m-2">
								<ProductLink productName={this.props.productName} />
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
	productName: PropTypes.string.isRequired
};

export default InDeliveryProductItem;
