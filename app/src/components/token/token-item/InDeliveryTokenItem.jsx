import React from 'react';
import PropTypes from 'prop-types'
import { Container,
	Row,
	Col,
	ListGroup
 } from 'react-bootstrap';

import TokenLink from "../token-page/TokenLink";
import { ZERO_ADDRESS } from '../../../store/constants';
import Address from '../Address'

class InDeliveryTokenItem extends React.Component {
	state = {
		dataKey: null
	}

	getPendingDelivery() {
		const dataKey = this.props.drizzle.contracts.Logistic.methods
		.tokensSentFrom.cacheCall(
			this.props.tokenId,
			this.props.drizzleState.accounts[0]
		);
		this.setState({ dataKey });
	}

	componentDidMount() {
		this.getPendingDelivery()
	}

	componentDidUpdate(prevProps, prevState) {
		if (this.props.tokenId !== prevProps.tokenId) {
			this.getPendingDelivery()
		}
	}

	render () {
		const tokenInDeliveryObject = this.props.drizzleState.contracts.Logistic
			.tokensSentFrom[this.state.dataKey]
		if (!tokenInDeliveryObject) return null
		const tokenInDelivery = tokenInDeliveryObject.value

		if (tokenInDelivery === ZERO_ADDRESS) return null

		return (
			<ListGroup.Item>
				<Container fluid>
				  <Row>
				    <Col md="auto">
							<span className="m-2">
								<TokenLink tokenId={this.props.tokenId} />
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

InDeliveryTokenItem.propTypes = {
	tokenId: PropTypes.string.isRequired
};

export default InDeliveryTokenItem;
