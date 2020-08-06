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
import { receive } from '../../../contract-call'

class WillReceiveProductItem extends React.Component {
	componentDidMount () {
		getPastEvents(
			this.props.drizzle,
			[PRODUCT_SHIPPED, PRODUCT_RECEIVED],
			{
				[PRODUCT_SHIPPED]: {
					to: this.props.drizzleState.accounts[0],
					productName: this.props.productName
				},
				[PRODUCT_RECEIVED]: {
					by: this.props.drizzleState.accounts[0],
					productI: this.props.productName
				}
			}
		)
	}

	receive = () => {
		const event = this.props.drizzleState.events.events.find(event => {
			return event.event === PRODUCT_SHIPPED &&
				event.returnValues.productName === this.props.productName &&
				event.returnValues.to === this.props.drizzleState.accounts[0];
		})
		receive(this.props.drizzle, event.returnValues.from, this.props.productName)
	}

	render () {
		const eventShip = this.props.drizzleState.events.events.find(event => {
			return event.event === PRODUCT_SHIPPED &&
				event.returnValues.productName === this.props.productName &&
				event.returnValues.to === this.props.drizzleState.accounts[0];
		})
		const eventReceive = this.props.drizzleState.events.events.find(event => {
			return event.event === PRODUCT_RECEIVED &&
				event.returnValues.productName === this.props.productName &&
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
									productName={this.props.productName}
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
	productName: PropTypes.string.isRequired
};

export default WillReceiveProductItem
