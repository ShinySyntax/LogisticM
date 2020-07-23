import React from 'react';
import { Container,
	Row,
	Col,
	ListGroup,
	Button
 } from 'react-bootstrap';
import { connect } from "react-redux";
import { PRODUCT_SHIPPED } from "../../utils/constants"

class WillReceiveTokenItem extends React.Component {
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

	receive = () => {
		const event = this.props.events.find(event => {
			return event.event === PRODUCT_SHIPPED &&
				event.returnValues.tokenId === this.props.tokenId;
		})
		this.props.drizzle.contracts.Logistic.methods.receive.cacheSend(
			event.returnValues.from,
			this.props.tokenId
		)
	}

	render () {
		const tokenInDeliveryObject = this.props.drizzleState.contracts.Logistic
			.pendingDeliveries[this.state.dataKey]
		if (!tokenInDeliveryObject) return null
		const tokenInDelivery = tokenInDeliveryObject.value

		if (tokenInDelivery !== this.props.drizzleState.accounts[0]) return null

		return (
			<ListGroup.Item>
				<Container fluid>
				  <Row>
				    <Col md={10}>
							<span className="m-2">
								{ this.props.tokenId }
							</span>
						</Col>
						<Col md={1}>
							<Button
								onClick={this.receive}
								aria-controls="receive-product"
							>
								<span>Receive</span>
							</Button>
						</Col>
				  </Row>
				</Container>

			</ListGroup.Item>
		)
	}
}

const mapStateToProps = state => {
	return { events: state.eventsReducer.events }
};

export default connect(mapStateToProps)(WillReceiveTokenItem)
