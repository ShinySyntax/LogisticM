import React from 'react';
import PropTypes from 'prop-types'
import { Container,
	Row,
	Col,
	ListGroup,
	Button } from 'react-bootstrap';

import { PRODUCT_SHIPPED,
 	PRODUCT_RECEIVED } from "../../../store/constants"
import ProductLink from "../product-page/ProductLink";
import { getPastEvents } from '../../../store/events-helpers'

class WillReceiveProductItem extends React.Component {
	componentDidMount () {
		getPastEvents(
			this.props.drizzle,
			[PRODUCT_SHIPPED, PRODUCT_RECEIVED],
			{
				[PRODUCT_SHIPPED]: {
					to: this.props.drizzleState.accounts[0],
					productId: this.props.productId
				},
				[PRODUCT_RECEIVED]: {
					by: this.props.drizzleState.accounts[0],
					productI: this.props.productId
				}
			}
		)
	}

	receive = () => {
		const event = this.props.drizzleState.events.events.find(event => {
			return event.event === PRODUCT_SHIPPED &&
				event.returnValues.productId === this.props.productId &&
				event.returnValues.to === this.props.drizzleState.accounts[0];
		})
		this.props.drizzle.contracts.Logistic.methods.receive.cacheSend(
			event.returnValues.from,
			this.props.productId
		)
	}

	render () {
		const eventShip = this.props.drizzleState.events.events.find(event => {
			return event.event === PRODUCT_SHIPPED &&
				event.returnValues.productId === this.props.productId &&
				event.returnValues.to === this.props.drizzleState.accounts[0];
		})
		const eventReceive = this.props.drizzleState.events.events.find(event => {
			return event.event === PRODUCT_RECEIVED &&
				event.returnValues.productId === this.props.productId &&
				event.returnValues.by === this.props.drizzleState.accounts[0];
		})

		if (!eventShip || eventReceive) return null

		return (
			<ListGroup.Item>
				<Container fluid>
				  <Row>
				    <Col md={10}>
							<span className="m-2">
								<ProductLink
									productId={this.props.productId}
								/>
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

WillReceiveProductItem.propTypes = {
	productId: PropTypes.string.isRequired
};

export default WillReceiveProductItem
