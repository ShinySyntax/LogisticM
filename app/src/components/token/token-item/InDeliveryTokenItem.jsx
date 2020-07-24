import React from 'react';
import { Container,
	Row,
	Col,
	ListGroup
 } from 'react-bootstrap';

import { ZERO_ADDRESS } from '../../../utils/constants';

class InDeliveryTokenItem extends React.Component {
	state = {
		dataKey: null
	}

	getPendingDelivery() {
		const dataKey = this.props.drizzle.contracts.Logistic.methods
		.pendingDeliveries.cacheCall(
			this.props.tokenId
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
			.pendingDeliveries[this.state.dataKey]
		if (!tokenInDeliveryObject) return null
		const tokenInDelivery = tokenInDeliveryObject.value

		if (tokenInDelivery === ZERO_ADDRESS) return null

		return (
			<ListGroup.Item>
				<Container fluid>
				  <Row>
				    <Col md="auto">
							<span className="m-2">
								{ this.props.tokenId }
							</span>
						</Col>
						<Col>
							<span className="m-2">
								to: { tokenInDelivery }
							</span>
						</Col>
				  </Row>
				</Container>

			</ListGroup.Item>
		)
	}
}

export default InDeliveryTokenItem;
