import React from 'react';
import { Container,
	Row,
	Col,
	ListGroup
 } from 'react-bootstrap';

import { ZERO_ADDRESS } from '../../../utils/constants';

class InDeliveryTokenItem extends React.Component {
	state = {
		show: true,
		open: false,
		address: null
	}

	componentDidMount() {
		this.tokenDeliveryFilter(this.props.tokenId)
			.then(show => this.setState({ show }))
	}

	tokenIsInDelivery = (tokenId) => {
		return this.props.drizzle.contracts.Logistic.methods
			.pendingDeliveries(tokenId).call()
			.then(receiverAccount => receiverAccount !== ZERO_ADDRESS );
	}

	tokenDeliveryFilter = (tokenId) => {
		return this.tokenIsInDelivery(tokenId)
	}

	handleChange = (event) => {
		this.setState({ address: event.target.value })
	}

	handleSubmit = (event) => {
		event.preventDefault();
		const { drizzle } = this.props;
    const contract = drizzle.contracts.Logistic;

		contract.methods.send.cacheSend(
			this.state.address,
			this.props.tokenId
		)
	}

	render () {
		if (!this.state.show) return null

		return (
			<ListGroup.Item>
				<Container fluid>
				  <Row>
				    <Col md={1}>
							<span className="m-2">
								{ this.props.tokenId }
							</span>
						</Col>
				  </Row>
				</Container>

			</ListGroup.Item>
		)
	}
}

export default InDeliveryTokenItem;
